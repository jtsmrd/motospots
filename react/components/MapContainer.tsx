import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMapBounds, getMapViewMode, getRiderCheckins, getRiderMeetups, getUserCheckin } from '../redux/Selectors';
import {
    getRiderCheckinsRequestAction, getRiderMeetupsRequestAction,
    removeExpiredRiderCheckins,
    setSelectedRiderCheckinAction,
    setSelectedRiderMeetupAction,
    updateMapBoundsAction,
    updateMapCenterAction,
    updateMapZoomAction,
} from '../redux/Actions';
import Map from './Map';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useMediaQuery, useTheme } from '@material-ui/core';
import * as Types from '../redux/Types';
import { useGeoLocation } from '../hooks/useGeoLocation';
import RiderCheckinView from './RiderCheckinView';
import SelectRiderMeetupLocationView from './SelectRiderMeetupLocationView';
import { MapViewMode } from '../redux/reducers/MapInfoReducer';
import RiderMeetupView from './RiderMeetupView';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            [theme.breakpoints.down('md')]: {
                height: '50vh',
            },
        },
    }),
);

const MapContainer: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const mapRef = useRef();
    const theme = useTheme();
    const [mapReady, setMapReady] = useState(false);
    const { geoLocationLat, geoLocationLng, geoLocationError } = useGeoLocation();
    const DEFAULT_ZOOM_LEVEL = 12;
    const pittsburghLatLng = {
        lat: 40.4406,
        lng: -79.9959
    };
    const mapBounds = useSelector(getMapBounds);
    const riderCheckins = useSelector(getRiderCheckins);
    const userCheckin = useSelector(getUserCheckin);
    const riderMeetups = useSelector(getRiderMeetups);
    const mapViewMode = useSelector(getMapViewMode);
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'), {
        defaultMatches: true,
    });

    // Set map center after getting users' geo location
    useEffect(() => {
        if (mapReady && geoLocationLat && geoLocationLng) {
            // @ts-ignore
            mapRef.current.map.setCenter({
                lat: geoLocationLat,
                lng: geoLocationLng,
            });
            updateMapBounds();
            updateMapCenter(geoLocationLat, geoLocationLng);

            // Initially fetch checkins and meetups. Only really need to
            // fetch meetups here, but fetching both for consistency.
            dispatch(getRiderCheckinsRequestAction({}));
            dispatch(getRiderMeetupsRequestAction({}));
        }
    }, [mapReady, geoLocationLat, geoLocationLng]);

    useEffect(() => {
        if (geoLocationError) {
            alert(geoLocationError);
        }
    }, [geoLocationError]);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(removeExpiredRiderCheckins({}));
        }, 300000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    function updateMapBounds() {
        // @ts-ignore
        const googleMapBounds = mapRef?.current?.map?.getBounds();
        if (googleMapBounds) {
            const ne = googleMapBounds.getNorthEast();
            const sw = googleMapBounds.getSouthWest();

            if (
                ne.lat() != mapBounds.neLat ||
                ne.lng() != mapBounds.neLng ||
                sw.lat() != mapBounds.swLat ||
                sw.lng() != mapBounds.swLng
            ) {
                dispatch(
                    updateMapBoundsAction({
                        mapBounds: {
                            neLat: ne.lat(),
                            neLng: ne.lng(),
                            swLat: sw.lat(),
                            swLng: sw.lng(),
                        },
                    }),
                );
            }
        }
    }

    function updateMapCenter(lat: number, lng: number) {
        dispatch(
            updateMapCenterAction({
                mapCenter: {
                    lat: lat,
                    lng: lng,
                },
            }),
        );
    }

    function updateMapZoom(mapZoom: number) {
        dispatch(updateMapZoomAction({ mapZoom: mapZoom }));
    }

    const onReady = (mapProps, map, event) => {
        setMapReady(true);
        updateMapCenter(map.center.lat(), map.center.lng());
        updateMapZoom(map.zoom);
    };

    const onDragEnd = (mapProps, map, event) => {
        updateMapBounds();
        updateMapCenter(map.center.lat(), map.center.lng());
    };

    const onZoomChanged = (mapProps, map, event) => {
        updateMapBounds();
        updateMapZoom(map.zoom);
    };

    const onRiderMarkerClicked = (riderCheckin: Types.RiderCheckin) => {
        dispatch(setSelectedRiderCheckinAction({ riderCheckin: riderCheckin }));
    };

    const onMeetupMarkerClicked = (riderMeetup: Types.RiderMeetup) => {
        dispatch(setSelectedRiderMeetupAction({ riderMeetup: riderMeetup }));
    };

    const getView = useCallback(() => {
        switch (mapViewMode) {
            case MapViewMode.RiderCheckins:
                return <RiderCheckinView />;
            case MapViewMode.RiderMeetups:
                return <RiderMeetupView />;
            case MapViewMode.CreateRiderMeetup:
                return <SelectRiderMeetupLocationView />;
            default:
                return null;
        }
    }, [mapViewMode]);

    return (
        <div className={classes.root}>
            <Map
                // @ts-ignore
                mapRef={mapRef}
                defaultZoomLevel={DEFAULT_ZOOM_LEVEL}
                initialCenter={{
                    lat: pittsburghLatLng.lat,
                    lng: pittsburghLatLng.lng
                }}
                onReady={onReady}
                onDragEnd={onDragEnd}
                onZoomChanged={onZoomChanged}
                riderCheckins={riderCheckins}
                riderMeetups={riderMeetups}
                userCheckin={userCheckin}
                onRiderMarkerClicked={onRiderMarkerClicked}
                onMeetupMarkerClicked={onMeetupMarkerClicked}
                isMobile={isMobile}
                mapViewMode={mapViewMode}
            />
            {getView()}
        </div>
    );
};

export default MapContainer;

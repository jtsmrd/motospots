import React from 'react';
import { Map as GoogleMap, GoogleApiWrapper, Marker } from 'google-maps-react';
import MarkerCluster from './MarkerCluster';
import * as Types from '../redux/Types';
import { MapViewMode } from '../redux/reducers/MapInfoReducer';
import MapMarker from './MapMarker';
import { mdiTooltipAccount, mdiAccountGroup } from '@mdi/js';

export interface MapProps {
    mapRef: object;
    defaultZoomLevel: number;
    riderCheckins: Types.RiderCheckin[];
    riderMeetups: Types.RiderMeetup[];
    userCheckin: Types.RiderCheckin;
    onReady: () => void;
    onDragEnd: () => void;
    onZoomChanged: () => void;
    onRiderMarkerClicked: (riderCheckin: Types.RiderCheckin) => void;
    onMeetupMarkerClicked: (riderMeetup: Types.RiderMeetup) => void;
    isMobile: boolean;
    mapViewMode: MapViewMode;
}

const Map: React.FC<MapProps> = (props) => {
    const {
        mapRef,
        defaultZoomLevel,
        onDragEnd,
        onZoomChanged,
        riderCheckins,
        riderMeetups,
        userCheckin,
        onReady,
        onRiderMarkerClicked,
        onMeetupMarkerClicked,
        isMobile,
        mapViewMode,
    } = props;

    const displayMeetups = () => {
        return riderMeetups.map((meetup) => {
            const meetupMarker = (
                <MapMarker
                    lat={meetup.lat}
                    lng={meetup.lng}
                    svgPath={mdiAccountGroup}
                    color={'orange'}
                    key={meetup.id}
                    onClick={() => {
                        onMeetupMarkerClicked(meetup);
                    }}
                />
            );
            return meetupMarker;
        });
    };

    const mapContent = () => {
        switch (mapViewMode) {
            case MapViewMode.RiderCheckins:
                let elements = [];

                if (userCheckin) {
                    elements.push(
                        <MapMarker
                            lat={userCheckin.lat}
                            lng={userCheckin.lng}
                            svgPath={mdiTooltipAccount}
                            color={'blue'}
                            key={userCheckin.id}
                            onClick={() => {
                                onRiderMarkerClicked(userCheckin);
                            }}
                        />,
                    );
                }
                elements.push(
                    <MarkerCluster key={1} riderCheckins={riderCheckins} onRiderMarkerClicked={onRiderMarkerClicked} />,
                );

                return elements;

            case MapViewMode.RiderMeetups:
                return displayMeetups();
            case MapViewMode.CreateRiderMeetup:
                return null;
            default:
                return null;
        }
    };

    return (
        <GoogleMap
            // @ts-ignore
            ref={mapRef}
            // @ts-ignore
            google={props.google}
            // @ts-ignore
            zoom={defaultZoomLevel}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            disableDefaultUI={isMobile}
            onReady={onReady}
            onDragend={onDragEnd}
            onZoomChanged={onZoomChanged}
        >
            {mapContent()}
        </GoogleMap>
    );
};

export default GoogleApiWrapper(
    { apiKey: 'AIzaSyADuYgHAFiqldTqvg_iT48-JDLCTWnCvwA' },
    // @ts-ignore
)(Map);

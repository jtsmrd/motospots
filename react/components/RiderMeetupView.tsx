import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import { getRiderMeetupsRequestAction, setMapViewModeAction, setSelectedRiderMeetupAction } from '../redux/Actions';
import RiderCheckinMeetupSelector from './RiderCheckinMeetupSelector';
import { MapViewMode } from '../redux/reducers/MapInfoReducer';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import * as Types from '../redux/Types';
import { getMapCenter, getMapZoom, getSelectedRiderMeetup } from '../redux/Selectors';
import RiderMeetupInfoDialog from './RiderMeetupInfoDialog';
import EditRiderMeetupDialog from './EditRiderMeetupDialog';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        meetupButton: {
            position: 'absolute',
            right: '1rem',
            bottom: '3rem',
            [theme.breakpoints.up('sm')]: {
                bottom: '150px',
                right: '0.5rem',
            },
        },
    }),
);

const RiderMeetupView: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const mapCenter = useSelector(getMapCenter);
    const mapZoom = useSelector(getMapZoom);
    const selectedRiderMeetup: Types.RiderMeetup = useSelector(getSelectedRiderMeetup);
    const [meetupInfoDialogVisible, setMeetupInfoDialogVisible] = useState(false);
    const [editMeetupInfoDialogVisible, setEditMeetupInfoDialogVisible] = useState(false);

    useEffect(() => {
        fetchRiderMeetups();
    }, [mapCenter]);

    useEffect(() => {
        fetchRiderMeetups();
    }, [mapZoom]);

    useEffect(() => {
        setMeetupInfoDialogVisible(selectedRiderMeetup !== null && !editMeetupInfoDialogVisible);
    }, [selectedRiderMeetup]);

    const fetchRiderMeetups = useCallback(() => {
        dispatch(getRiderMeetupsRequestAction({}));
    }, [dispatch]);

    const createRiderMeetup = useCallback(() => {
        dispatch(setMapViewModeAction({ mapViewMode: MapViewMode.CreateRiderMeetup }));
    }, [dispatch]);

    const onCloseRiderMeetupInfoDialog = useCallback(() => {
        dispatch(setSelectedRiderMeetupAction({ riderMeetup: null }));
    }, [dispatch]);

    const onEditRiderMeetup = useCallback(() => {
        setMeetupInfoDialogVisible(false);
        setEditMeetupInfoDialogVisible(true);
    }, []);

    const onCloseEditRiderMeetupDialog = useCallback(() => {
        setEditMeetupInfoDialogVisible(false);
        setMeetupInfoDialogVisible(true);
    }, []);

    const onRiderMeetupDeleted = useCallback(() => {
        setEditMeetupInfoDialogVisible(false);
        dispatch(setSelectedRiderMeetupAction({ riderMeetup: null }));
    }, [dispatch]);

    return (
        <React.Fragment>
            <RiderCheckinMeetupSelector />
            <Fab color="secondary" aria-label="add" className={classes.meetupButton} onClick={createRiderMeetup}>
                <MyLocationIcon />
            </Fab>
            <RiderMeetupInfoDialog
                open={meetupInfoDialogVisible}
                onClose={onCloseRiderMeetupInfoDialog}
                onEditRiderMeetup={onEditRiderMeetup}
                riderMeetup={selectedRiderMeetup}
            />
            {selectedRiderMeetup && (
                <EditRiderMeetupDialog
                    open={editMeetupInfoDialogVisible}
                    onClose={onCloseEditRiderMeetupDialog}
                    onDelete={onRiderMeetupDeleted}
                    riderMeetup={selectedRiderMeetup}
                />
            )}
        </React.Fragment>
    );
};

export default RiderMeetupView;

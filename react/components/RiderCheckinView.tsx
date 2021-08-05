import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import { getMapCenter, getMapZoom, getSelectedRiderCheckin } from '../redux/Selectors';
import { getRiderCheckinsRequestAction, setSelectedRiderCheckinAction } from '../redux/Actions';
import CreateRiderCheckinDialog from './CreateRiderCheckinDialog';
import EditRiderCheckinDialog from './EditRiderCheckinDialog';
import RiderCheckinMeetupSelector from './RiderCheckinMeetupSelector';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import RiderCheckinInfoDialog from './RiderCheckinInfoDialog';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        checkinButton: {
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

const RiderCheckinView: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const mapCenter = useSelector(getMapCenter);
    const mapZoom = useSelector(getMapZoom);
    const selectedRiderCheckin = useSelector(getSelectedRiderCheckin);
    const [checkinDialogVisible, setCheckinDialogVisible] = useState(false);
    const [editRiderCheckinDialogVisible, setEditRiderCheckinDialogVisible] = useState(false);
    const [riderCheckinInfoDialogVisible, setRiderCheckinInfoDialogVisible] = useState(false);

    useEffect(() => {
        fetchRiderCheckins();
    }, [mapCenter]);

    useEffect(() => {
        fetchRiderCheckins();
    }, [mapZoom]);

    useEffect(() => {
        setRiderCheckinInfoDialogVisible(selectedRiderCheckin !== null);
    }, [selectedRiderCheckin]);

    const fetchRiderCheckins = useCallback(() => {
        dispatch(getRiderCheckinsRequestAction({}));
    }, []);

    const onCloseRiderCheckinInfoDialog = useCallback(() => {
        dispatch(setSelectedRiderCheckinAction({ riderCheckin: null }));
    }, [dispatch]);

    const onEditRiderCheckin = useCallback(() => {
        setRiderCheckinInfoDialogVisible(false);
        setEditRiderCheckinDialogVisible(true);
    }, []);

    const onCloseEditRiderCheckinDialog = useCallback(() => {
        setEditRiderCheckinDialogVisible(false);
        setRiderCheckinInfoDialogVisible(true);
    }, []);

    const onRiderCheckinDeleted = useCallback(() => {
        dispatch(setSelectedRiderCheckinAction({ riderCheckin: null }));
    }, [dispatch]);

    return (
        <React.Fragment>
            <RiderCheckinMeetupSelector />
            <Fab
                color="primary"
                aria-label="add"
                className={classes.checkinButton}
                onClick={() => {
                    setCheckinDialogVisible(true);
                }}
            >
                <MyLocationIcon />
            </Fab>
            <CreateRiderCheckinDialog
                open={checkinDialogVisible}
                onClose={() => {
                    setCheckinDialogVisible(false);
                }}
            />
            <RiderCheckinInfoDialog
                open={riderCheckinInfoDialogVisible}
                onClose={onCloseRiderCheckinInfoDialog}
                onEditRiderCheckin={onEditRiderCheckin}
                riderCheckin={selectedRiderCheckin}
            />
            {selectedRiderCheckin && (
                <EditRiderCheckinDialog
                    open={editRiderCheckinDialogVisible}
                    onClose={onCloseEditRiderCheckinDialog}
                    onDelete={onRiderCheckinDeleted}
                    riderCheckin={selectedRiderCheckin}
                />
            )}
        </React.Fragment>
    );
};

export default RiderCheckinView;

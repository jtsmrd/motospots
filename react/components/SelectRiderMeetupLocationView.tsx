import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { setMapViewModeAction } from '../redux/Actions';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import { MapViewMode } from '../redux/reducers/MapInfoReducer';
import CreateRiderMeetupDialog from './CreateRiderMeetupDialog';
import { getMapCenter } from '../redux/Selectors';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bottomButtonContainer: {
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            position: 'absolute',
            bottom: '2rem',
            [theme.breakpoints.up('sm')]: {
                justifyContent: 'space-evenly',
            },
        },
        cancelButton: {
            backgroundColor: 'red',
            color: 'white',
            textTransform: 'capitalize',
            width: '40%',
            [theme.breakpoints.up('sm')]: {
                width: '200px',
            },
            '&:hover': {
                backgroundColor: 'red',
                opacity: 0.5,
            },
        },
        confirmButton: {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            textTransform: 'capitalize',
            width: '40%',
            [theme.breakpoints.up('sm')]: {
                width: '200px',
            },
            '&:hover': {
                backgroundColor: theme.palette.primary.main,
                opacity: 0.5,
            },
        },
        meetupReticleContainer: {
            position: 'absolute',
            zIndex: 1,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
        },
    }),
);

const SelectRiderMeetupLocationView: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const mapCenter = useSelector(getMapCenter);
    const [isSelectingLocation, setIsSelectingLocation] = useState(false);
    const [meetupLocation, setMeetupLocation] = useState(null);

    const confirmMeetupLocation = useCallback(() => {
        setMeetupLocation({ lat: mapCenter.lat, lng: mapCenter.lng });
        setIsSelectingLocation(false);
    }, [mapCenter]);

    const cancelCreateMeetup = useCallback(() => {
        dispatch(setMapViewModeAction({ mapViewMode: MapViewMode.RiderMeetups }));
    }, [dispatch]);

    return (
        <React.Fragment>
            <CreateRiderMeetupDialog
                open={!isSelectingLocation}
                onClose={cancelCreateMeetup}
                selectMeetupLocation={() => {
                    setIsSelectingLocation(true);
                }}
                meetupLocation={meetupLocation}
            />
            {isSelectingLocation && (
                <React.Fragment>
                    <Box className={classes.meetupReticleContainer}>
                        <GpsNotFixedIcon color={'primary'} />
                    </Box>
                    <Box className={classes.bottomButtonContainer}>
                        <Button
                            variant={'outlined'}
                            className={classes.cancelButton}
                            onClick={() => {
                                setIsSelectingLocation(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button variant={'outlined'} className={classes.confirmButton} onClick={confirmMeetupLocation}>
                            Confirm
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default SelectRiderMeetupLocationView;

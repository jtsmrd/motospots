import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Box, Button, createStyles, Dialog, IconButton, TextField, Typography } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { FormHelperText } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { createRiderMeetupRequestAction } from '../redux/Actions';
import DateFnsUtils from '@date-io/date-fns';
import add from 'date-fns/add';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import InfoDialog from './InfoDialog';
import * as Types from '../redux/Types';

export interface CreateRiderMeetupDialogProps {
    open: boolean;
    onClose: () => void;
    selectMeetupLocation: () => void;
    meetupLocation?: Types.MapCoords;
}

interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
    infoButtonSelected: () => void;
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(1),
            paddingLeft: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, infoButtonSelected, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6">{children}</Typography>
                <IconButton id="info-button" aria-label="info" onClick={infoButtonSelected}>
                    <InfoOutlinedIcon />
                </IconButton>
            </Box>
            {onClose ? (
                <IconButton id="close-button" aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        meetupLocationText: {
            fontSize: '1rem',
            marginRight: '0.5rem',
        },
        meetupLocationSetText: {
            fontSize: '1rem',
            fontWeight: 500,
            color: 'green',
            textAlign: 'center',
        },
        meetupLocationNotSetText: {
            fontSize: '1rem',
            fontWeight: 500,
            color: 'red',
            textAlign: 'center',
        },
        setLocationButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
        setLocationButtonError: {
            color: 'red',
            borderColor: 'red',
            textTransform: 'capitalize',
        },
        locationHelperText: {
            color: 'red',
        },
        meetupTitleTextField: {
            marginTop: '1rem',
        },
        meetupDescriptionTextField: {
            marginTop: '1rem',
        },
        datePickersContainer: {
            marginTop: '1rem',
        },
        meetupDatePicker: {
            marginBottom: '1rem',
        },
        hangoutTimeText: {
            marginTop: '1rem',
            fontSize: '0.8rem',
            fontWeight: 300,
        },
        confirmButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
    }),
);

const CreateRiderMeetupDialog: React.FC<CreateRiderMeetupDialogProps> = (props) => {
    const { open, onClose, selectMeetupLocation, meetupLocation } = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const [infoDialogVisible, setInfoDialogVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [meetupDate, setMeetupDate] = useState(null);
    const [rideStartDate, setRideStartDate] = useState(null);
    const [confirmSelected, setConfirmSelected] = useState(false);

    // Text displayed for meetup location button
    const meetupLocationButtonText = useMemo(() => {
        return meetupLocation ? 'Update' : 'Set';
    }, [meetupLocation]);

    // Displays the time interval in words between the meetup time and ride time
    const hangoutTimeText = useMemo(() => {
        return rideStartDate && meetupDate && formatDistanceStrict(rideStartDate, meetupDate);
    }, [rideStartDate, meetupDate]);

    // User can only proceed when meetupLocation, meetupDate, and rideStartDate are selected
    const canProceed = useMemo(() => {
        return meetupLocation !== null && meetupDate !== null && rideStartDate !== null;
    }, [meetupLocation, meetupDate, rideStartDate]);

    // Display the Meetup info dialog
    const infoButtonSelected = () => {
        setInfoDialogVisible(true);
    };

    const onTitleChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
    };

    const onDescriptionChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.currentTarget.value);
    };

    const meetupDateSelected = (date) => {
        setMeetupDate(date);
        const defaultRideStartDate = add(date, {
            minutes: 30,
        });
        setRideStartDate(defaultRideStartDate);
    };

    const rideStartDateSelected = (date) => {
        setRideStartDate(date);
    };

    const createMeetup = () => {
        if (canProceed) {
            dispatch(
                createRiderMeetupRequestAction({
                    lat: meetupLocation.lat,
                    lng: meetupLocation.lng,
                    title: title,
                    description: description,
                    meetup_date: meetupDate.toISOString(),
                    ride_start_date: rideStartDate.toISOString(),
                }),
            );
            onClose();
        } else {
            setConfirmSelected(true);
        }
    };

    return (
        <React.Fragment>
            <Dialog id="create-meetup-dialog" fullWidth open={open} onClose={onClose}>
                <DialogTitle id="create-meetup-dialog-title" onClose={onClose} infoButtonSelected={infoButtonSelected}>
                    Create Meetup
                </DialogTitle>
                <DialogContent dividers>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            {meetupLocation ? (
                                <Typography className={classes.meetupLocationSetText}>Location set</Typography>
                            ) : (
                                <Typography className={classes.meetupLocationNotSetText}>Location not set</Typography>
                            )}
                        </Box>
                        <Button
                            variant={'outlined'}
                            className={
                                confirmSelected && !meetupLocation
                                    ? classes.setLocationButtonError
                                    : classes.setLocationButton
                            }
                            onClick={selectMeetupLocation}
                        >
                            {meetupLocationButtonText}
                        </Button>
                    </Box>
                    {confirmSelected && !meetupLocation && (
                        <FormHelperText className={classes.locationHelperText}>
                            Set a location to proceed
                        </FormHelperText>
                    )}
                    <Box display={'flex'} flexDirection={'column'}>
                        <TextField
                            id="create-meetup-title"
                            label="Title"
                            variant="outlined"
                            className={classes.meetupTitleTextField}
                            value={title}
                            onChange={onTitleChanged}
                        />
                        <TextField
                            id="create-meetup-description"
                            label="Description"
                            variant="outlined"
                            className={classes.meetupDescriptionTextField}
                            multiline
                            maxRows={2}
                            onChange={onDescriptionChanged}
                        />
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} className={classes.datePickersContainer}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                id="create-meetup-meetup-date"
                                label="Meetup time"
                                className={classes.meetupDatePicker}
                                inputVariant="outlined"
                                disablePast
                                value={meetupDate}
                                error={confirmSelected && !meetupDate}
                                helperText={confirmSelected && !meetupDate ? 'Select a meetup date to proceed' : ''}
                                onChange={setMeetupDate}
                                onAccept={meetupDateSelected}
                            />
                            <DateTimePicker
                                id="create-meetup-ride-start-date"
                                label="Ride out time"
                                inputVariant="outlined"
                                disablePast
                                value={rideStartDate}
                                onChange={setRideStartDate}
                                onAccept={rideStartDateSelected}
                            />
                        </MuiPickersUtilsProvider>
                    </Box>
                    {hangoutTimeText && (
                        <Typography className={classes.hangoutTimeText}>
                            Time before rideout: {hangoutTimeText}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant={'outlined'} className={classes.confirmButton} onClick={createMeetup}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <InfoDialog
                open={infoDialogVisible}
                onClose={() => {
                    setInfoDialogVisible(false);
                }}
                titleText="Create Meetup"
                infoText="Meetups allow riders to plan a ride by specifying where to meet,
                    what time everyone should plan on being there, and what time everyone
                    should be ready to ride out."
            />
        </React.Fragment>
    );
};

export default CreateRiderMeetupDialog;

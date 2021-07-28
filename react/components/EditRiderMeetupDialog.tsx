import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Box, Button, createStyles, Dialog, IconButton, TextField, Typography } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { formatToLocalDate } from '../utilities/dateTimeUtils';
import { expireRiderMeetupRequestAction, updateRiderMeetupRequestAction } from '../redux/Actions';
import DateFnsUtils from '@date-io/date-fns';
import add from 'date-fns/add';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as Types from '../redux/Types';
import ConfirmDialog from './ConfirmDialog';

export interface EditRiderMeetupDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    riderMeetup: Types.RiderMeetup;
}

interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
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
        deleteButton: {
            color: 'red',
            textTransform: 'capitalize',
        },
        confirmButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
    }),
);

const EditRiderMeetupDialog: React.FC<EditRiderMeetupDialogProps> = (props) => {
    const { open, onClose, onDelete, riderMeetup } = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const [title, setTitle] = useState(riderMeetup?.title);
    const [description, setDescription] = useState(riderMeetup?.description);
    const [meetupDate, setMeetupDate] = useState(formatToLocalDate(riderMeetup?.meetupDate));
    const [rideStartDate, setRideStartDate] = useState(formatToLocalDate(riderMeetup?.rideStartDate));
    const [confirmSelected, setConfirmSelected] = useState(false);
    const [confirmDeleteDialogVisible, setConfirmDeleteDialogVisible] = useState(false);

    // Displays the time interval in words between the meetup time and ride time
    const hangoutTimeText = useMemo(() => {
        return rideStartDate && meetupDate && formatDistanceStrict(rideStartDate, meetupDate);
    }, [rideStartDate, meetupDate]);

    // User can only proceed when meetupLocation, meetupDate, and rideStartDate are selected
    const canProceed = useMemo(() => {
        return meetupDate !== null && rideStartDate !== null;
    }, [meetupDate, rideStartDate]);

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

    const onConfirmDeleteRiderMeetup = useCallback(() => {
        setConfirmDeleteDialogVisible(false);
        dispatch(expireRiderMeetupRequestAction({ id: riderMeetup.id }));
        onDelete();
    }, [dispatch, riderMeetup]);

    const updateRiderMeetup = useCallback(() => {
        if (canProceed) {
            dispatch(
                updateRiderMeetupRequestAction({
                    id: riderMeetup.id,
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
    }, [dispatch, riderMeetup, title, description, meetupDate, rideStartDate]);

    return (
        <React.Fragment>
            <Dialog id="edit-meetup-dialog" fullWidth open={open} onClose={onClose}>
                <DialogTitle id="edit-meetup-dialog-title" onClose={onClose}>
                    Update Meetup
                </DialogTitle>
                <DialogContent dividers>
                    <Box display={'flex'} flexDirection={'column'}>
                        <TextField
                            id="edit-meetup-title"
                            label="Title"
                            variant="outlined"
                            className={classes.meetupTitleTextField}
                            value={title}
                            onChange={onTitleChanged}
                        />
                        <TextField
                            id="edit-meetup-description"
                            label="Description"
                            variant="outlined"
                            className={classes.meetupDescriptionTextField}
                            multiline
                            maxRows={2}
                            value={description}
                            onChange={onDescriptionChanged}
                        />
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} className={classes.datePickersContainer}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                id="edit-meetup-meetup-date"
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
                                id="edit-meetup-ride-start-date"
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
                    <Button
                        variant={'outlined'}
                        className={classes.deleteButton}
                        onClick={() => {
                            setConfirmDeleteDialogVisible(true);
                        }}
                    >
                        Delete
                    </Button>
                    <Button variant={'outlined'} className={classes.confirmButton} onClick={updateRiderMeetup}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog
                open={confirmDeleteDialogVisible}
                onClose={() => {
                    setConfirmDeleteDialogVisible(false);
                }}
                onConfirm={onConfirmDeleteRiderMeetup}
                cancelText={'Cancel'}
                confirmText={'Are you sure you want to delete this Meetup?'}
                confirmButtonText={'Yes, delete'}
                confirmIsDestructive={true}
            />
        </React.Fragment>
    );
};

export default EditRiderMeetupDialog;

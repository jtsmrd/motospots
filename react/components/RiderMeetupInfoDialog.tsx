import React, { useMemo } from 'react';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Dialog, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import * as Types from '../redux/Types';
import '../utilities/date.string.extensions';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import Cookie from 'js-cookie';
import {formatToLocalDate} from "../utilities/dateTimeUtils";

export interface RiderMeetupInfoDialogProps {
    open: boolean;
    onClose: any;
    onEditRiderMeetup: () => void;
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
        titleText: {
            marginRight: '50px',
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
            <Typography className={classes.titleText} variant="h6">
                {children}
            </Typography>
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
        descriptionText: {
            marginBottom: '1rem',
        },
        hangoutTimeText: {
            marginTop: '1rem',
            fontSize: '0.8rem',
            fontWeight: 300,
        },
        editButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
    }),
);

const RiderMeetupInfoDialog: React.FC<RiderMeetupInfoDialogProps> = (props) => {
    const { open, onClose, onEditRiderMeetup, riderMeetup } = props;
    const userUUID = Cookie.get('user_uuid');
    const classes = useStyles();

    const isOwner = useMemo(() => {
        return userUUID === riderMeetup?.userUUID;
    }, [riderMeetup]);

    // Displays the time interval in words between the meetup time and ride time
    const hangoutTimeText = useMemo(() => {
        return (
            riderMeetup?.rideStartDate &&
            riderMeetup?.meetupDate &&
            formatDistanceStrict(formatToLocalDate(riderMeetup.rideStartDate), formatToLocalDate(riderMeetup.meetupDate))
        );
    }, [riderMeetup]);

    return (
        <Dialog id="rider-meetup-info-dialog" fullWidth open={open} onClose={onClose}>
            <DialogTitle id="meetup-title" onClose={onClose}>
                {riderMeetup?.title}
            </DialogTitle>
            <DialogContent dividers>
                <Typography id="meetup-description" className={classes.descriptionText}>
                    {riderMeetup?.description}
                </Typography>
                <Typography id="meetup-start-date">
                    Meetup {riderMeetup?.meetupDate.formatTodayTomorrowTime()}
                </Typography>
                <Typography id="meetup-expire-date">
                    Rideout {riderMeetup?.rideStartDate.formatTodayTomorrowTime()}
                </Typography>
                <Typography className={classes.hangoutTimeText}>Time before rideout: {hangoutTimeText}</Typography>
            </DialogContent>
            {isOwner && (
                <DialogActions>
                    <Button variant={'outlined'} className={classes.editButton} onClick={onEditRiderMeetup}>
                        Edit
                    </Button>
                    {/*ToDo: Allow non-creator users to show interest*/}
                    {/*<Button onClick={onClose} color="primary">*/}
                    {/*    Interested*/}
                    {/*</Button>*/}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default RiderMeetupInfoDialog;

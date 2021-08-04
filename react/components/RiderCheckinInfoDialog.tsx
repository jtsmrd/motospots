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

export interface RiderCheckinInfoDialogProps {
    open: boolean;
    onClose: () => void;
    onEditRiderCheckin: () => void;
    riderCheckin: Types.RiderCheckin;
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
        motorcycleMakeModelText: {
            marginBottom: '2rem',
            fontWeight: 300,
        },
        checkinTimeText: {
            fontSize: '0.8rem',
            fontWeight: 300,
            marginBottom: '0.5rem',
        },
        expireTimeText: {
            fontSize: '0.8rem',
            fontWeight: 300,
            marginBottom: '0.5rem',
        },
        editButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
    }),
);

const RiderCheckinInfoDialog: React.FC<RiderCheckinInfoDialogProps> = (props) => {
    const { open, onClose, onEditRiderCheckin, riderCheckin } = props;
    const userUUID = Cookie.get('user_uuid');
    const classes = useStyles();

    const isOwner = useMemo(() => {
        return userUUID === riderCheckin?.userUUID;
    }, [riderCheckin]);

    const expireDateDisplay = useMemo(() => {
        return riderCheckin?.expireDate.formatTodayTomorrowTime();
    }, [riderCheckin]);

    // Displays the time interval in words between the meetup time and ride time
    const checkinTimeText = useMemo(() => {
        return (
            riderCheckin?.createDate &&
            formatDistanceStrict(new Date(), formatToLocalDate(riderCheckin.createDate))
        );
    }, [riderCheckin]);

    return (
        <Dialog id="rider-checkin-info-dialog" fullWidth open={open} onClose={onClose}>
            <DialogTitle id="rider-checkin-dialog-title" onClose={onClose}>
                Rider Checkin
            </DialogTitle>
            <DialogContent dividers>
                {riderCheckin?.motorcycleMakeModel && (
                    <Typography className={classes.motorcycleMakeModelText}>
                        Motorcycle make/model: {riderCheckin?.motorcycleMakeModel}
                    </Typography>
                )}
                {isOwner ? (
                    <Typography className={classes.checkinTimeText}>You checked in {checkinTimeText} ago</Typography>
                ) : (
                    <Typography className={classes.checkinTimeText}>Rider checked in {checkinTimeText} ago</Typography>
                )}
                <Typography className={classes.expireTimeText}>Expires {expireDateDisplay}</Typography>
            </DialogContent>
            {isOwner && (
                <DialogActions>
                    <Button variant={'outlined'} className={classes.editButton} onClick={onEditRiderCheckin}>
                        Edit
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default RiderCheckinInfoDialog;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Dialog, IconButton, TextField, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { createRiderCheckinRequestAction } from '../redux/Actions';
import { formatLocalTodayTomorrowTime, getDateAddingMinutes } from '../utilities/dateTimeUtils';
import { usePosition } from '../hooks/usePosition';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import InfoDialog from './InfoDialog';
import '../utilities/date.string.extensions';

export interface RiderCheckinDialogProps {
    open: boolean;
    onClose: () => void;
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
        motorcycleMakeModelTextField: {
            display: 'flex',
            flex: 1,
            marginBottom: '1.5rem',
        },
        expireButtonContainer: {
            margin: '1rem auto',
        },
        expireIntervalButton: {
            width: '50px',
        },
        expireIntervalButtonText: {
            textTransform: 'lowercase',
        },
        expiresText: {
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 300,
        },
        confirmButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
    }),
);

const CreateRiderCheckinDialog: React.FC<RiderCheckinDialogProps> = (props) => {
    const { open, onClose } = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const { positionLat, positionLng, positionError } = usePosition();
    const [infoDialogVisible, setInfoDialogVisible] = useState(false);
    const [expireInterval, setExpireInterval] = useState(15);
    const [motorcycleMakeModel, setMotorcycleMakeModel] = useState('');

    const expireDateDisplay = useMemo(() => {
        return formatLocalTodayTomorrowTime(getDateAddingMinutes(expireInterval));
    }, [expireInterval]);

    useEffect(() => {
        if (positionError) {
            alert(positionError);
        }
    }, [positionError]);

    const onMotorcycleMakeModelChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMotorcycleMakeModel(event.currentTarget.value);
    };

    const handleExpireIntervalSelected = (event: React.MouseEvent<HTMLElement>, expireInterval: number | null) => {
        setExpireInterval(expireInterval);
    };

    const infoButtonSelected = () => {
        setInfoDialogVisible(true);
    };

    const handleCheckin = useCallback(() => {
        if (positionLat && positionLng) {
            dispatch(
                createRiderCheckinRequestAction({
                    expire_date: getDateAddingMinutes(expireInterval).toISOString(),
                    motorcycle_make_model: motorcycleMakeModel,
                    lat: positionLat,
                    lng: positionLng,
                }),
            );
            onClose();
        } else {
            alert('You must enable location to checkin');
        }
    }, [positionLat, positionLng, dispatch, expireInterval, motorcycleMakeModel]);

    return (
        <React.Fragment>
            <Dialog id="rider-checkin-dialog" fullWidth open={open} onClose={onClose}>
                <DialogTitle id="rider-checkin-title" onClose={onClose} infoButtonSelected={infoButtonSelected}>
                    Create Checkin
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        id="create-rider-checkin-motorcycle-make-model"
                        label="Motorcycle make/model (optional)"
                        variant="outlined"
                        className={classes.motorcycleMakeModelTextField}
                        value={motorcycleMakeModel}
                        onChange={onMotorcycleMakeModelChanged}
                    />
                    <Typography id="rider-checkin-hangout-question">How long do you plan on hanging out?</Typography>
                    <Box display="flex">
                        <ToggleButtonGroup
                            id="expire-interval-button-group"
                            className={classes.expireButtonContainer}
                            value={expireInterval}
                            exclusive
                            onChange={handleExpireIntervalSelected}
                        >
                            <ToggleButton id="expire-interval-15" value={15} className={classes.expireIntervalButton}>
                                <Typography className={classes.expireIntervalButtonText}>15m</Typography>
                            </ToggleButton>
                            <ToggleButton id="expire-interval-30" value={30} className={classes.expireIntervalButton}>
                                <Typography className={classes.expireIntervalButtonText}>30m</Typography>
                            </ToggleButton>
                            <ToggleButton id="expire-interval-60" value={60} className={classes.expireIntervalButton}>
                                <Typography className={classes.expireIntervalButtonText}>1h</Typography>
                            </ToggleButton>
                            <ToggleButton id="expire-interval-120" value={120} className={classes.expireIntervalButton}>
                                <Typography className={classes.expireIntervalButtonText}>2h</Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Typography className={classes.expiresText}>Expires {expireDateDisplay}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant={'outlined'} className={classes.confirmButton} onClick={handleCheckin}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <InfoDialog
                open={infoDialogVisible}
                onClose={() => {
                    setInfoDialogVisible(false);
                }}
                titleText="Rider Checkin"
                infoText="A checkin uses your current location and adds a marker to
                    the map for other riders to see.
                    <br>
                    Specify how long you plan on hanging out at your current spot.
                    <br>
                    Once that time is up, your marker will be removed, unless you
                    decide to extend your time."
            />
        </React.Fragment>
    );
};

export default CreateRiderCheckinDialog;

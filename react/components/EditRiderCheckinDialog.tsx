import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Dialog, IconButton, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { expireRiderCheckinRequestAction, updateRiderCheckinRequestAction } from '../redux/Actions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import InfoDialog from './InfoDialog';
import '../utilities/date.string.extensions';
import ConfirmDialog from './ConfirmDialog';
import * as Types from '../redux/Types';
import { addMinutesToDate, formatLocalTodayTomorrowTime, formatToLocalDate } from '../utilities/dateTimeUtils';

export interface EditRiderCheckinDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    riderCheckin: Types.RiderCheckin;
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
        extendButtonContainer: {
            margin: '1rem auto',
        },
        extendIntervalButton: {
            width: '50px',
        },
        extendIntervalButtonText: {
            textTransform: 'capitalize',
        },
        motorcycleMakeModelText: {
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontWeight: 300,
        },
        currentExpireTimeText: {
            marginBottom: '0.5rem',
        },
        expiresText: {
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 300,
        },
        updateButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
        deleteButton: {
            color: 'red',
            textTransform: 'capitalize',
        },
    }),
);

const EditRiderCheckinDialog: React.FC<EditRiderCheckinDialogProps> = (props) => {
    const { open, onClose, onDelete, riderCheckin } = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const [infoDialogVisible, setInfoDialogVisible] = useState(false);
    const [motorcycleMakeModel, setMotorcycleMakeModel] = useState(riderCheckin?.motorcycleMakeModel ?? '');
    const [extendInterval, setExtendInterval] = useState(0);
    const [confirmDeleteDialogVisible, setConfirmDeleteDialogVisible] = useState(false);

    const currentExpireDateDisplay = useMemo(() => {
        return riderCheckin?.expireDate.formatTodayTomorrowTime();
    }, [riderCheckin]);

    const newExpireDate = useMemo(() => {
        return extendInterval > 0
            ? addMinutesToDate(formatToLocalDate(riderCheckin?.expireDate), extendInterval)
            : null;
    }, [riderCheckin, extendInterval]);

    const newExpireDateDisplay = useMemo(() => {
        return newExpireDate ? formatLocalTodayTomorrowTime(newExpireDate) : null;
    }, [newExpireDate]);

    const updateDisabled = useMemo(() => {
        return riderCheckin?.motorcycleMakeModel === motorcycleMakeModel && extendInterval === 0;
    }, [motorcycleMakeModel, extendInterval]);

    const onMotorcycleMakeModelChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMotorcycleMakeModel(event.currentTarget.value);
    };

    const handleExtendIntervalSelected = (event: React.MouseEvent<HTMLElement>, extendInterval: number | null) => {
        setExtendInterval(extendInterval);
    };

    const infoButtonSelected = () => {
        setInfoDialogVisible(true);
    };

    const handleUpdateCheckin = useCallback(() => {
        dispatch(
            updateRiderCheckinRequestAction({
                id: riderCheckin.id,
                motorcycle_make_model: motorcycleMakeModel,
                expire_date: newExpireDate.toISOString(),
            }),
        );
        onClose();
    }, [dispatch, riderCheckin, newExpireDate, motorcycleMakeModel]);

    const onConfirmDeleteRiderCheckin = useCallback(() => {
        setConfirmDeleteDialogVisible(false);
        dispatch(expireRiderCheckinRequestAction({ id: riderCheckin.id }));
        onDelete();
    }, [riderCheckin, dispatch]);

    return (
        <React.Fragment>
            <Dialog id="edit-rider-checkin-dialog" fullWidth open={open} onClose={onClose}>
                <DialogTitle
                    id="edit-rider-checkin-dialog-title"
                    onClose={onClose}
                    infoButtonSelected={infoButtonSelected}
                >
                    Update Checkin
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        id="edit-rider-checkin-motorcycle-make-model"
                        label="Motorcycle make/model (optional)"
                        variant="outlined"
                        className={classes.motorcycleMakeModelTextField}
                        value={motorcycleMakeModel}
                        onChange={onMotorcycleMakeModelChanged}
                    />
                    <Typography className={classes.currentExpireTimeText}>
                        Your checkin will expire {currentExpireDateDisplay}.
                    </Typography>
                    <Typography id="rider-checkin-extend-question">Do you want to extend it?</Typography>
                    <Box display="flex">
                        <ToggleButtonGroup
                            id="extend-interval-button-group"
                            className={classes.extendButtonContainer}
                            value={extendInterval}
                            exclusive
                            onChange={handleExtendIntervalSelected}
                        >
                            <ToggleButton id="extend-interval-0" value={0} className={classes.extendIntervalButton}>
                                <Typography className={classes.extendIntervalButtonText}>No</Typography>
                            </ToggleButton>
                            <ToggleButton id="extend-interval-15" value={15} className={classes.extendIntervalButton}>
                                <Typography className={classes.extendIntervalButtonText}>15m</Typography>
                            </ToggleButton>
                            <ToggleButton id="extend-interval-30" value={30} className={classes.extendIntervalButton}>
                                <Typography className={classes.extendIntervalButtonText}>30m</Typography>
                            </ToggleButton>
                            <ToggleButton id="extend-interval-60" value={60} className={classes.extendIntervalButton}>
                                <Typography className={classes.extendIntervalButtonText}>1h</Typography>
                            </ToggleButton>
                            <ToggleButton id="extend-interval-120" value={120} className={classes.extendIntervalButton}>
                                <Typography className={classes.extendIntervalButtonText}>2h</Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    {extendInterval > 0 && (
                        <Typography className={classes.expiresText}>
                            Will be extended until {newExpireDateDisplay}
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
                    <Button
                        variant={'outlined'}
                        className={classes.updateButton}
                        disabled={updateDisabled}
                        onClick={handleUpdateCheckin}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            <InfoDialog
                open={infoDialogVisible}
                onClose={() => {
                    setInfoDialogVisible(false);
                }}
                titleText="Update Checkin"
                infoText="If you plan on hanging out a bit longer at your current
                    spot, you can extend your checkin time.
                    <br>
                    If you're leaving, you can delete your checkin before it expires."
            />
            <ConfirmDialog
                open={confirmDeleteDialogVisible}
                onClose={() => {
                    setConfirmDeleteDialogVisible(false);
                }}
                onConfirm={onConfirmDeleteRiderCheckin}
                cancelText={'Cancel'}
                confirmText={'Are you sure you want to delete your Checkin?'}
                confirmButtonText={'Yes, delete'}
                confirmIsDestructive={true}
            />
        </React.Fragment>
    );
};

export default EditRiderCheckinDialog;

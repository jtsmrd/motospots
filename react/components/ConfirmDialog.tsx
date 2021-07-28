import React from 'react';
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Button, createStyles, Dialog, Typography } from '@material-ui/core';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

export interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cancelText: string;
    confirmText: string;
    confirmButtonText: string;
    confirmIsDestructive: boolean;
}

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
        confirmText: {
            marginTop: '1rem',
        },
        cancelButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
        confirmButton: {
            color: theme.palette.primary.main,
            textTransform: 'capitalize',
        },
        confirmButtonDestructive: {
            color: 'red',
            textTransform: 'capitalize',
        },
    }),
);

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
    const { open, onClose, onConfirm, cancelText, confirmText, confirmButtonText, confirmIsDestructive } = props;
    const classes = useStyles();

    return (
        <Dialog id="confirm-dialog" fullWidth open={open} onClose={onClose}>
            <DialogContent dividers>
                <Typography className={classes.confirmText}>{confirmText}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} className={classes.cancelButton} onClick={onClose}>
                    {cancelText}
                </Button>
                <Button
                    variant={'outlined'}
                    className={confirmIsDestructive ? classes.confirmButtonDestructive : classes.confirmButton}
                    onClick={onConfirm}
                >
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;

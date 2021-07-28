import React, { useCallback } from 'react';
import { Box, Dialog, IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

export interface InfoDialogProps {
    open: boolean;
    onClose: () => void;
    titleText: string;
    infoText: string;
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        infoText: {
            marginBottom: '1rem',
        },
    }),
);

const InfoDialog: React.FC<InfoDialogProps> = (props) => {
    const { open, onClose, titleText, infoText } = props;
    const classes = useStyles();

    const formatTitleText = useCallback(() => {
        return infoText.split('<br>').map((text, index) => {
            return (
                <Typography key={index} className={classes.infoText}>
                    {text}
                </Typography>
            );
        });
    }, [infoText]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle id="info-title" onClose={onClose}>
                {titleText}
            </DialogTitle>
            <DialogContent dividers>{formatTitleText()}</DialogContent>
        </Dialog>
    );
};

export default InfoDialog;

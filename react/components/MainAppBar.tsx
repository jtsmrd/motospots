import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoDialog from './InfoDialog';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            backgroundColor: theme.palette.primary.dark,
        },
        infoButton: {
            color: '#FFFFFF',
        },
        title: {
            color: '#FFFFFF',
        },
    }),
);

const MainAppBar: React.FC<{}> = (props) => {
    const classes = useStyles();
    const [infoDialogVisible, setInfoDialogVisible] = useState(false);

    return (
        <React.Fragment>
            <AppBar position={'static'} className={classes.appBar}>
                <Toolbar>
                    <Typography variant={'h6'} className={classes.title}>
                        MotoSpots
                    </Typography>
                    <IconButton
                        id="info-button"
                        aria-label="info"
                        className={classes.infoButton}
                        onClick={() => {
                            setInfoDialogVisible(true);
                        }}
                    >
                        <InfoOutlinedIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <InfoDialog
                open={infoDialogVisible}
                onClose={() => {
                    setInfoDialogVisible(false);
                }}
                titleText="Welcome to MotoSpots!"
                infoText='Have you been riding and wondered "Where&apos;s everyone
                    at?" or "Where is everyone meeting up?"
                    <br>
                    If you have, you&apos;re in the right place!
                    <br>
                    MotoSpots is a simple web app that answers those questions. Using
                    location, you can "Check in" to a spot to let other riders
                    know where you&apos;re hanging out or you can create a "Meetup"
                    to organize a group ride.
                    <br>
                    Enjoy!'
            />
        </React.Fragment>
    );
};

export default MainAppBar;

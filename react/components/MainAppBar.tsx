import React, {useCallback, useEffect, useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoDialog from './InfoDialog';
import Cookie from 'js-cookie';

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
        logo: {
            height: '50px',
            marginRight: '1rem',
            marginLeft: '-0.5rem',
        }
    }),
);

const MainAppBar: React.FC<{}> = (props) => {
    const classes = useStyles();
    const [infoDialogVisible, setInfoDialogVisible] = useState(false);

    useEffect(() => {
        if (!Cookie.get('tutorial_displayed')) {
            setInfoDialogVisible(true);
        }
    }, [])

    const setTutorialCookie = useCallback(() => {
        if (!Cookie.get('tutorial_displayed')) {
            Cookie.set('tutorial_displayed', true);
        }
    }, [])

    return (
        <React.Fragment>
            <AppBar position={'static'} className={classes.appBar}>
                <Toolbar>
                    {/*<img*/}
                    {/*    className={classes.logo}*/}
                    {/*    src={window.location.origin + '/images/motospots_logo_v4.png'}*/}
                    {/*    alt={'Motorcyle logo'}*/}
                    {/*/>*/}
                    <Typography variant={'h5'} className={classes.title}>
                        Motospots
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
                    setTutorialCookie();
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

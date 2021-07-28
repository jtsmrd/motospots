import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Close from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // display: 'inline-flex',
            flex: 1,
            // flexDirection: 'column',
            // height: '100%',
            backgroundColor: 'lightblue',
        },
    }),
);

const Profile: React.FC<{}> = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <p>Profile</p>
            <div style={{ display: 'inline-flex', backgroundColor: 'red' }}>
                <div style={{ height: '100px', width: '100px', backgroundColor: 'palevioletred' }}></div>
                <div style={{ height: '100px', backgroundColor: 'blue' }}>
                    <p>This is a sentence.</p>
                </div>
                <div style={{ height: '100px', backgroundColor: 'green' }}>
                    <Button>
                        <Close></Close>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

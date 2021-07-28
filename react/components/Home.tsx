import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MapContainer from './MapContainer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flex: 1,
            position: 'relative',
            height: '100%',
        },
    }),
);

const Home: React.FC<{}> = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MapContainer />
        </div>
    );
};

export default Home;

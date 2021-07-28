import { combineReducers } from 'redux';
import RiderCheckinReducer from './RiderCheckinReducer';
import MapInfoReducer from './MapInfoReducer';
import RiderMeetupReducer from './RiderMeetupReducer';

export default combineReducers({
    riderCheckins: RiderCheckinReducer,
    mapInfo: MapInfoReducer,
    riderMeetups: RiderMeetupReducer,
});

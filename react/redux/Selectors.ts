import { statePropName as riderCheckinStatePropName, IRiderCheckinState } from './reducers/RiderCheckinReducer';
import { statePropName as mapStatePropName, IMapInfoState } from './reducers/MapInfoReducer';
import { statePropName as riderMeetupStatePropName, IRiderMeetupState } from './reducers/RiderMeetupReducer';
import * as Types from './Types';

export interface IAppState {
    [riderCheckinStatePropName]: IRiderCheckinState;
    [mapStatePropName]: IMapInfoState;
    [otherKeys: string]: any;
}

const riderCheckinState = (state: IAppState) => state[riderCheckinStatePropName];

export const getRiderCheckins = (state: IAppState) => riderCheckinState(state).riderCheckins;
export const getUserCheckin = (state: IAppState): Types.RiderCheckin => riderCheckinState(state).userCheckin;
export const getVisibleRiderCheckins = (state: IAppState) => riderCheckinState(state).visibleRiderCheckins;
export const getPreviousRiderCheckinFetchInfo = (state: IAppState) => riderCheckinState(state).previousFetchInfo;

const mapInfoState = (state: IAppState) => state[mapStatePropName];

export const getMapBounds = (state: IAppState) => mapInfoState(state).mapBounds;
export const getMapZoom = (state: IAppState) => mapInfoState(state).mapZoom;
export const getMapCenter = (state: IAppState) => mapInfoState(state).mapCenter;
export const getMapCenterLoaded = (state: IAppState) => mapInfoState(state).mapCenterLoaded;
export const getSelectedRiderCheckin = (state: IAppState) => mapInfoState(state).selectedRiderCheckin;
export const getSelectedRiderMeetup = (state: IAppState) => mapInfoState(state).selectedRiderMeetup;
export const getMapViewMode = (state: IAppState) => mapInfoState(state).mapViewMode;

const riderMeetupState = (state: IAppState) => state[riderMeetupStatePropName];

export const getRiderMeetupState = (state: IAppState) => riderMeetupState(state);
export const getRiderMeetups = (state: IAppState) => riderMeetupState(state).riderMeetups;
export const getVisibleRiderMeetups = (state: IAppState) => riderMeetupState(state).visibleRiderMeetups;

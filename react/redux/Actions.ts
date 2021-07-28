import actionCreatorFactory, { ActionCreator } from 'typescript-fsa';
import * as ActionTypes from './ActionTypes';

const actionCreator = actionCreatorFactory();

//<editor-fold desc="RiderCheckin Actions">

export const getRiderCheckinsRequestAction: ActionCreator<any> = actionCreator<any>(
    ActionTypes.GET_RIDER_CHECKINS_REQUEST,
);

export const getRiderCheckinsResponseAction: ActionCreator<ActionTypes.IGetRiderCheckinsResponsePayload> =
    actionCreator<ActionTypes.IGetRiderCheckinsResponsePayload>(ActionTypes.GET_RIDER_CHECKINS_RESPONSE);

export const createRiderCheckinRequestAction: ActionCreator<ActionTypes.ICreateRiderCheckinRequestPayload> =
    actionCreator<ActionTypes.ICreateRiderCheckinRequestPayload>(ActionTypes.CREATE_RIDER_CHECKIN_REQUEST);

export const createRiderCheckinResponseAction: ActionCreator<ActionTypes.ICreateRiderCheckinResponsePayload> =
    actionCreator<ActionTypes.ICreateRiderCheckinResponsePayload>(ActionTypes.CREATE_RIDER_CHECKIN_RESPONSE);

export const updateVisibleRiderCheckinsAction: ActionCreator<any> = actionCreator<any>(
    ActionTypes.UPDATE_VISIBLE_RIDER_CHECKINS,
);

export const setVisibleRiderCheckinsAction: ActionCreator<ActionTypes.ISetVisibleRiderCheckinsPayload> =
    actionCreator<ActionTypes.ISetVisibleRiderCheckinsPayload>(ActionTypes.SET_VISIBLE_RIDER_CHECKINS);

export const expireRiderCheckinRequestAction: ActionCreator<ActionTypes.IExpireRiderCheckinRequestPayload> =
    actionCreator<ActionTypes.IExpireRiderCheckinRequestPayload>(ActionTypes.EXPIRE_RIDER_CHECKIN_REQUEST);

export const expireRiderCheckinResponseAction: ActionCreator<ActionTypes.IExpireRiderCheckinResponsePayload> =
    actionCreator<ActionTypes.IExpireRiderCheckinResponsePayload>(ActionTypes.EXPIRE_RIDER_CHECKIN_RESPONSE);

export const removeExpiredRiderCheckins: ActionCreator<ActionTypes.IRemoveExpiredRiderCheckinsPayload> =
    actionCreator<ActionTypes.IRemoveExpiredRiderCheckinsPayload>(ActionTypes.REMOVE_EXPIRED_RIDER_CHECKINS);

export const updateRiderCheckinFetchInfoAction: ActionCreator<ActionTypes.IUpdateRiderCheckinFetchInfoPayload> =
    actionCreator<ActionTypes.IUpdateRiderCheckinFetchInfoPayload>(ActionTypes.UPDATE_RIDER_CHECKIN_FETCH_INFO);

export const updateRiderCheckinRequestAction: ActionCreator<ActionTypes.IUpdateRiderCheckinRequestPayload> =
    actionCreator<ActionTypes.IUpdateRiderCheckinRequestPayload>(ActionTypes.UPDATE_RIDER_CHECKIN_REQUEST);

export const updateRiderCheckinResponseAction: ActionCreator<ActionTypes.IUpdateRiderCheckinResponsePayload> =
    actionCreator<ActionTypes.IUpdateRiderCheckinResponsePayload>(ActionTypes.UPDATE_RIDER_CHECKIN_RESPONSE);

//</editor-fold>

//<editor-fold desc="MapInfo Actions">

export const updateMapBoundsAction: ActionCreator<ActionTypes.IUpdateMapBoundsPayload> =
    actionCreator<ActionTypes.IUpdateMapBoundsPayload>(ActionTypes.UPDATE_MAP_BOUNDS);

export const updateMapCenterAction: ActionCreator<ActionTypes.IUpdateMapCenterPayload> =
    actionCreator<ActionTypes.IUpdateMapCenterPayload>(ActionTypes.UPDATE_MAP_CENTER);

export const updateMapZoomAction: ActionCreator<ActionTypes.IUpdateMapZoomPayload> =
    actionCreator<ActionTypes.IUpdateMapZoomPayload>(ActionTypes.UPDATE_MAP_ZOOM);

export const setSelectedRiderCheckinAction: ActionCreator<ActionTypes.ISetSelectedRiderCheckinPayload> =
    actionCreator<ActionTypes.ISetSelectedRiderCheckinPayload>(ActionTypes.SET_SELECTED_RIDER_CHECKIN);

export const setSelectedRiderMeetupAction: ActionCreator<ActionTypes.ISetSelectedRiderMeetupPayload> =
    actionCreator<ActionTypes.ISetSelectedRiderMeetupPayload>(ActionTypes.SET_SELECTED_RIDER_MEETUP);

export const setMapViewModeAction: ActionCreator<ActionTypes.ISetMapViewMode> =
    actionCreator<ActionTypes.ISetMapViewMode>(ActionTypes.SET_MAP_VIEW_MODE);

//</editor-fold>

//<editor-fold desc="RiderMeetup Actions">

export const createRiderMeetupRequestAction: ActionCreator<ActionTypes.ICreateRiderMeetupRequestPayload> =
    actionCreator<ActionTypes.ICreateRiderMeetupRequestPayload>(ActionTypes.CREATE_RIDER_MEETUP_REQUEST);

export const createRiderMeetupResponseAction: ActionCreator<ActionTypes.ICreateRiderMeetupResponsePayload> =
    actionCreator<ActionTypes.ICreateRiderMeetupResponsePayload>(ActionTypes.CREATE_RIDER_MEETUP_RESPONSE);

export const updateRiderMeetupRequestAction: ActionCreator<ActionTypes.IUpdateRiderMeetupRequestPayload> =
    actionCreator<ActionTypes.IUpdateRiderMeetupRequestPayload>(ActionTypes.UPDATE_RIDER_MEETUP_REQUEST);

export const updateRiderMeetupResponseAction: ActionCreator<ActionTypes.IUpdateRiderMeetupResponsePayload> =
    actionCreator<ActionTypes.IUpdateRiderMeetupResponsePayload>(ActionTypes.UPDATE_RIDER_MEETUP_RESPONSE);

export const expireRiderMeetupRequestAction: ActionCreator<ActionTypes.IExpireRiderMeetupRequestPayload> =
    actionCreator<ActionTypes.IExpireRiderMeetupRequestPayload>(ActionTypes.EXPIRE_RIDER_MEETUP_REQUEST);

export const expireRiderMeetupResponseAction: ActionCreator<ActionTypes.IExpireRiderMeetupResponsePayload> =
    actionCreator<ActionTypes.IExpireRiderMeetupResponsePayload>(ActionTypes.EXPIRE_RIDER_MEETUP_RESPONSE);

export const getRiderMeetupsRequestAction: ActionCreator<any> = actionCreator<any>(
    ActionTypes.GET_RIDER_MEETUPS_REQUEST,
);

export const getRiderMeetupsResponseAction: ActionCreator<ActionTypes.IGetRiderMeetupsResponsePayload> =
    actionCreator<ActionTypes.IGetRiderMeetupsResponsePayload>(ActionTypes.GET_RIDER_MEETUPS_RESPONSE);

export const updateVisibleRiderMeetupsAction: ActionCreator<any> = actionCreator<any>(
    ActionTypes.UPDATE_VISIBLE_RIDER_MEETUPS,
);

export const setVisibleRiderMeetupsAction: ActionCreator<ActionTypes.ISetVisibleRiderMeetupsPayload> =
    actionCreator<ActionTypes.ISetVisibleRiderMeetupsPayload>(ActionTypes.SET_VISIBLE_RIDER_MEETUPS);

//</editor-fold>

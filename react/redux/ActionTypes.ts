import * as Types from './Types';
import { MapViewMode } from './reducers/MapInfoReducer';

//<editor-fold desc="IRiderCheckinActionsPayload">

export const GET_RIDER_CHECKINS_REQUEST = 'GET_RIDER_CHECKINS_REQUEST';
export type GET_RIDER_CHECKINS_REQUEST = typeof GET_RIDER_CHECKINS_REQUEST;

export const GET_RIDER_CHECKINS_RESPONSE = 'GET_RIDER_CHECKINS_RESPONSE';
export type GET_RIDER_CHECKINS_RESPONSE = typeof GET_RIDER_CHECKINS_RESPONSE;
export interface IGetRiderCheckinsResponsePayload {
    riderCheckins: Types.RiderCheckin[];
}

export const CREATE_RIDER_CHECKIN_REQUEST = 'CREATE_RIDER_CHECKIN_REQUEST';
export type CREATE_RIDER_CHECKIN_REQUEST = typeof CREATE_RIDER_CHECKIN_REQUEST;
export interface ICreateRiderCheckinRequestPayload {
    expire_date?: string;
    motorcycle_make_model?: string;
    lat: number;
    lng: number;
}

export const CREATE_RIDER_CHECKIN_RESPONSE = 'CREATE_RIDER_CHECKIN_RESPONSE';
export type CREATE_RIDER_CHECKIN_RESPONSE = typeof CREATE_RIDER_CHECKIN_RESPONSE;
export interface ICreateRiderCheckinResponsePayload {
    riderCheckin: Types.RiderCheckin;
}

export const UPDATE_VISIBLE_RIDER_CHECKINS = 'UPDATE_VISIBLE_RIDER_CHECKINS';
export type UPDATE_VISIBLE_RIDER_CHECKINS = typeof UPDATE_VISIBLE_RIDER_CHECKINS;

export const SET_VISIBLE_RIDER_CHECKINS = 'SET_VISIBLE_RIDER_CHECKINS';
export type SET_VISIBLE_RIDER_CHECKINS = typeof SET_VISIBLE_RIDER_CHECKINS;
export interface ISetVisibleRiderCheckinsPayload {
    visibleRiderCheckins: Types.RiderCheckin[];
}

export const EXPIRE_RIDER_CHECKIN_REQUEST = 'EXPIRE_RIDER_CHECKIN_REQUEST';
export type EXPIRE_RIDER_CHECKIN_REQUEST = typeof EXPIRE_RIDER_CHECKIN_REQUEST;
export interface IExpireRiderCheckinRequestPayload {
    id: number;
}

export const EXPIRE_RIDER_CHECKIN_RESPONSE = 'EXPIRE_RIDER_CHECKIN_RESPONSE';
export type EXPIRE_RIDER_CHECKIN_RESPONSE = typeof EXPIRE_RIDER_CHECKIN_RESPONSE;
export interface IExpireRiderCheckinResponsePayload {
    expiredRiderCheckin: Types.RiderCheckin;
}

export const REMOVE_EXPIRED_RIDER_CHECKINS = 'REMOVE_EXPIRED_RIDER_CHECKINS';
export type REMOVE_EXPIRED_RIDER_CHECKINS = typeof REMOVE_EXPIRED_RIDER_CHECKINS;
export interface IRemoveExpiredRiderCheckinsPayload {}

export const UPDATE_RIDER_CHECKIN_FETCH_INFO = 'UPDATE_RIDER_CHECKIN_FETCH_INFO';
export type UPDATE_RIDER_CHECKIN_FETCH_INFO = typeof UPDATE_RIDER_CHECKIN_FETCH_INFO;
export interface IUpdateRiderCheckinFetchInfoPayload {
    timestamp: number;
    bounds: Types.MapBounds;
}

export const UPDATE_RIDER_CHECKIN_REQUEST = 'UPDATE_RIDER_CHECKIN_REQUEST';
export type UPDATE_RIDER_CHECKIN_REQUEST = typeof UPDATE_RIDER_CHECKIN_REQUEST;
export interface IUpdateRiderCheckinRequestPayload {
    id: number;
    expire_date?: string;
    motorcycle_make_model?: string;
}

export const UPDATE_RIDER_CHECKIN_RESPONSE = 'UPDATE_RIDER_CHECKIN_RESPONSE';
export type UPDATE_RIDER_CHECKIN_RESPONSE = typeof UPDATE_RIDER_CHECKIN_RESPONSE;
export interface IUpdateRiderCheckinResponsePayload {
    riderCheckin: Types.RiderCheckin;
}

//</editor-fold>

//<editor-fold desc="IMapActionsPayload">

export const UPDATE_MAP_BOUNDS = 'UPDATE_MAP_BOUNDS';
export type UPDATE_MAP_BOUNDS = typeof UPDATE_MAP_BOUNDS;
export interface IUpdateMapBoundsPayload {
    mapBounds: Types.MapBounds;
}

export const UPDATE_MAP_CENTER = 'UPDATE_MAP_CENTER';
export type UPDATE_MAP_CENTER = typeof UPDATE_MAP_CENTER;
export interface IUpdateMapCenterPayload {
    mapCenter: Types.MapCenter;
}

export const UPDATE_MAP_ZOOM = 'UPDATE_MAP_ZOOM';
export type UPDATE_MAP_ZOOM = typeof UPDATE_MAP_ZOOM;
export interface IUpdateMapZoomPayload {
    mapZoom: number;
}

export const SET_SELECTED_RIDER_CHECKIN = 'SET_SELECTED_RIDER_CHECKIN';
export type SET_SELECTED_RIDER_CHECKIN = typeof SET_SELECTED_RIDER_CHECKIN;
export interface ISetSelectedRiderCheckinPayload {
    riderCheckin?: Types.RiderCheckin;
}

export const SET_SELECTED_RIDER_MEETUP = 'SET_SELECTED_RIDER_MEETUP';
export type SET_SELECTED_RIDER_MEETUP = typeof SET_SELECTED_RIDER_MEETUP;
export interface ISetSelectedRiderMeetupPayload {
    riderMeetup?: Types.RiderMeetup;
}

export const SET_MAP_VIEW_MODE = 'SET_MAP_VIEW_MODE';
export type SET_MAP_VIEW_MODE = typeof SET_MAP_VIEW_MODE;
export interface ISetMapViewMode {
    mapViewMode: MapViewMode;
}

//</editor-fold>

//<editor-fold desc="IRiderMeetupActionsPayload">

export const CREATE_RIDER_MEETUP_REQUEST = 'CREATE_RIDER_MEETUP_REQUEST';
export type CREATE_RIDER_MEETUP_REQUEST = typeof CREATE_RIDER_MEETUP_REQUEST;
export interface ICreateRiderMeetupRequestPayload {
    lat: number;
    lng: number;
    title: string;
    description: string;
    meetup_date: string;
    ride_start_date: string;
}

export const CREATE_RIDER_MEETUP_RESPONSE = 'CREATE_RIDER_MEETUP_RESPONSE';
export type CREATE_RIDER_MEETUP_RESPONSE = typeof CREATE_RIDER_MEETUP_RESPONSE;
export interface ICreateRiderMeetupResponsePayload {
    riderMeetup: Types.RiderMeetup;
}

export const UPDATE_RIDER_MEETUP_REQUEST = 'UPDATE_RIDER_MEETUP_REQUEST';
export type UPDATE_RIDER_MEETUP_REQUEST = typeof UPDATE_RIDER_MEETUP_REQUEST;
export interface IUpdateRiderMeetupRequestPayload {
    id: number;
    title: string;
    description: string;
    meetup_date: string;
    ride_start_date: string;
}

export const UPDATE_RIDER_MEETUP_RESPONSE = 'UPDATE_RIDER_MEETUP_RESPONSE';
export type UPDATE_RIDER_MEETUP_RESPONSE = typeof UPDATE_RIDER_MEETUP_RESPONSE;
export interface IUpdateRiderMeetupResponsePayload {
    riderMeetup: Types.RiderMeetup;
}

export const EXPIRE_RIDER_MEETUP_REQUEST = 'EXPIRE_RIDER_MEETUP_REQUEST';
export type EXPIRE_RIDER_MEETUP_REQUEST = typeof EXPIRE_RIDER_MEETUP_REQUEST;
export interface IExpireRiderMeetupRequestPayload {
    id: number;
}

export const EXPIRE_RIDER_MEETUP_RESPONSE = 'EXPIRE_RIDER_MEETUP_RESPONSE';
export type EXPIRE_RIDER_MEETUP_RESPONSE = typeof EXPIRE_RIDER_MEETUP_RESPONSE;
export interface IExpireRiderMeetupResponsePayload {
    expiredRiderMeetup: Types.RiderMeetup;
}

export const GET_RIDER_MEETUPS_REQUEST = 'GET_RIDER_MEETUPS_REQUEST';
export type GET_RIDER_MEETUPS_REQUEST = typeof GET_RIDER_MEETUPS_REQUEST;

export const GET_RIDER_MEETUPS_RESPONSE = 'GET_RIDER_MEETUPS_RESPONSE';
export type GET_RIDER_MEETUPS_RESPONSE = typeof GET_RIDER_MEETUPS_RESPONSE;
export interface IGetRiderMeetupsResponsePayload {
    riderMeetups: Types.RiderMeetup[];
}

export const UPDATE_VISIBLE_RIDER_MEETUPS = 'UPDATE_VISIBLE_RIDER_MEETUPS';
export type UPDATE_VISIBLE_RIDER_MEETUPS = typeof UPDATE_VISIBLE_RIDER_MEETUPS;

export const SET_VISIBLE_RIDER_MEETUPS = 'SET_VISIBLE_RIDER_MEETUPS';
export type SET_VISIBLE_RIDER_MEETUPS = typeof SET_VISIBLE_RIDER_MEETUPS;
export interface ISetVisibleRiderMeetupsPayload {
    visibleRiderMeetups: Types.RiderMeetup[];
}

//</editor-fold>

export type IRiderCheckinActionsPayload =
    | IGetRiderCheckinsResponsePayload
    | ISetVisibleRiderCheckinsPayload
    | ICreateRiderCheckinRequestPayload
    | ICreateRiderCheckinResponsePayload
    | IExpireRiderCheckinRequestPayload
    | IExpireRiderCheckinResponsePayload
    | IRemoveExpiredRiderCheckinsPayload
    | IUpdateRiderCheckinFetchInfoPayload
    | IUpdateRiderCheckinRequestPayload
    | IUpdateRiderCheckinResponsePayload;

export type IMapActionsPayload =
    | IUpdateMapBoundsPayload
    | IUpdateMapCenterPayload
    | IUpdateMapZoomPayload
    | ISetSelectedRiderCheckinPayload
    | ISetSelectedRiderMeetupPayload
    | ISetMapViewMode;

export type IRiderMeetupActionsPayload =
    | ICreateRiderMeetupRequestPayload
    | ICreateRiderMeetupResponsePayload
    | IGetRiderMeetupsResponsePayload
    | ISetVisibleRiderMeetupsPayload
    | IUpdateRiderMeetupRequestPayload
    | IUpdateRiderMeetupResponsePayload
    | IExpireRiderMeetupRequestPayload
    | IExpireRiderMeetupResponsePayload;

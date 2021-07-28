import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import * as ActionTypes from '../ActionTypes';
import * as Actions from '../Actions';
import * as Types from '../Types';
import * as Endpoints from '../../constants/Endpoints';
import { request as httpRequest } from '../../client';
import { getMapBounds, getMapCenter, getMapZoom, getRiderMeetups } from '../Selectors';
import { currentDateIsAfter } from '../../utilities/dateTimeUtils';
import { MapViewMode } from '../reducers/MapInfoReducer';

function* createRiderMeetup(action: Action<ActionTypes.ICreateRiderMeetupRequestPayload>) {
    try {
        const res = yield call(httpRequest, {
            url: Endpoints.CREATE_RIDER_MEETUP,
            method: 'POST',
            data: {
                lat: action.payload.lat,
                lng: action.payload.lng,
                title: action.payload.title,
                description: action.payload.description,
                meetup_date: action.payload.meetup_date,
                ride_start_date: action.payload.ride_start_date,
            },
        });
        const riderMeetupPayload: ActionTypes.ICreateRiderMeetupResponsePayload = {
            riderMeetup: res.data,
        };
        yield put(Actions.createRiderMeetupResponseAction(riderMeetupPayload));
        yield put(Actions.setMapViewModeAction({ mapViewMode: MapViewMode.RiderMeetups }));
        yield call(updateVisibleRiderMeetups);
    } catch (e) {
        yield put(Actions.createRiderMeetupResponseAction(e));
    }
}

function* fetchRiderMeetups() {
    const mapZoom = yield select(getMapZoom);
    const mapCenter = yield select(getMapCenter);
    // const mapBounds = yield select(getMapBounds);
    const distance = getSearchDistance(mapZoom);

    //ToDo: Limit fetch calls

    try {
        const res = yield call(httpRequest, {
            url: Endpoints.GET_RIDER_MEETUPS,
            method: 'GET',
            params: {
                lat: mapCenter.lat,
                lng: mapCenter.lng,
                distance: distance,
            },
        });

        const riderMeetupsPayload: ActionTypes.IGetRiderMeetupsResponsePayload = {
            riderMeetups: res.data,
        };
        yield put(Actions.getRiderMeetupsResponseAction(riderMeetupsPayload));
        yield call(updateVisibleRiderMeetups);
    } catch (e) {
        yield put(Actions.getRiderMeetupsResponseAction(e));
    }
}

function* updateRiderMeetup(action: Action<ActionTypes.IUpdateRiderMeetupRequestPayload>) {
    try {
        const res = yield call(httpRequest, {
            url: Endpoints.updateRiderMeetup(action.payload.id),
            method: 'PUT',
            data: {
                title: action.payload.title,
                description: action.payload.description,
                meetup_date: action.payload.meetup_date,
                ride_start_date: action.payload.ride_start_date,
            },
        });
        const riderMeetupPayload: ActionTypes.IUpdateRiderMeetupResponsePayload = {
            riderMeetup: res.data,
        };
        yield put(Actions.updateRiderMeetupResponseAction(riderMeetupPayload));
        yield put(Actions.setSelectedRiderMeetupAction({ riderMeetup: riderMeetupPayload.riderMeetup }));
    } catch (e) {
        yield put(Actions.updateRiderMeetupResponseAction(e));
    }
}

function* expireRiderMeetup(action: Action<ActionTypes.IExpireRiderMeetupRequestPayload>) {
    try {
        const res = yield call(httpRequest, {
            url: Endpoints.expireRiderMeetup(action.payload.id),
            method: 'DELETE',
        });
        const riderMeetupPayload: ActionTypes.IExpireRiderMeetupResponsePayload = {
            expiredRiderMeetup: res.data,
        };
        yield put(Actions.expireRiderMeetupResponseAction(riderMeetupPayload));
        yield call(updateVisibleRiderMeetups);
    } catch (e) {
        yield put(Actions.expireRiderMeetupResponseAction(e));
    }
}

function* updateVisibleRiderMeetups() {
    const riderMeetups = yield select(getRiderMeetups);
    const mapBounds = yield select(getMapBounds);
    const visibleRiderMeetups = getVisibleRiderMeetups(riderMeetups, mapBounds);
    const visibleRiderMeetupsPayload: ActionTypes.ISetVisibleRiderMeetupsPayload = {
        visibleRiderMeetups: visibleRiderMeetups,
    };
    yield put(Actions.setVisibleRiderMeetupsAction(visibleRiderMeetupsPayload));
}

function getVisibleRiderMeetups(riderMeetups: Types.RiderMeetup[], mapBounds: Types.MapBounds) {
    return riderMeetups.filter((rm) => {
        return (
            rm.lat < mapBounds.neLat &&
            rm.lat > mapBounds.swLat &&
            rm.lng < mapBounds.neLng &&
            rm.lng > mapBounds.swLng &&
            !currentDateIsAfter(rm.expireDate)
        );
    });
}

function getSearchDistance(zoomLevel: number): number {
    // Zoom distances for 100px by 100px screen
    const zoomDistances = [
        { zoom: 11, distance: 4.8 },
        { zoom: 12, distance: 2.4 },
    ];
    const controlZoom = 13;
    const controlDistance = 1.2;

    // Figure out how to calculate distance using a control zoom/ distance

    const multiplyFactor = window.innerHeight / 100;
    switch (zoomLevel) {
        case 1:
            return 4915.2 * multiplyFactor;
        case 2:
            return 2457.6 * multiplyFactor;
        case 3:
            return 1228.8 * multiplyFactor;
        case 4:
            return 614.4 * multiplyFactor;
        case 5:
            return 307.2 * multiplyFactor;
        case 6:
            return 153.6 * multiplyFactor;
        case 7:
            return 76.8 * multiplyFactor;
        case 8:
            return 38.4 * multiplyFactor;
        case 9:
            return 19.2 * multiplyFactor;
        case 10:
            return 9.6 * multiplyFactor;
        case 11:
            return 4.8 * multiplyFactor;
        case 12:
            return 2.4 * multiplyFactor;
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
            return 1.2 * multiplyFactor;
        default:
            return 200;
    }
}

export default function* watchRiderMeetupRequests() {
    yield all([
        takeLatest(ActionTypes.CREATE_RIDER_MEETUP_REQUEST, createRiderMeetup),
        takeLatest(ActionTypes.UPDATE_RIDER_MEETUP_REQUEST, updateRiderMeetup),
        takeLatest(ActionTypes.EXPIRE_RIDER_MEETUP_REQUEST, expireRiderMeetup),
        takeLatest(ActionTypes.GET_RIDER_MEETUPS_REQUEST, fetchRiderMeetups),
        takeLatest(ActionTypes.UPDATE_VISIBLE_RIDER_MEETUPS, updateVisibleRiderMeetups),
    ]);
}

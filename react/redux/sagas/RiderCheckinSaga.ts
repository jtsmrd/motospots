import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import * as ActionTypes from '../ActionTypes';
import * as Actions from '../Actions';
import * as Types from '../Types';
import * as Endpoints from '../../constants/Endpoints';
import { request as httpRequest } from '../../client';
import {
    getMapBounds,
    getMapCenter,
    getMapZoom,
    getPreviousRiderCheckinFetchInfo,
    getRiderCheckins,
} from '../Selectors';
import {
    currentDateIsAfter,
    currentTimeIsAfterTimePlusMinutes,
    getCurrentTimestamp,
} from '../../utilities/dateTimeUtils';

function* createRiderCheckin(action: Action<ActionTypes.ICreateRiderCheckinRequestPayload>) {
    try {
        const res = yield call(httpRequest, {
            url: Endpoints.CREATE_RIDER_CHECKIN,
            method: 'POST',
            data: {
                expire_date: action.payload.expire_date,
                motorcycle_make_model: action.payload.motorcycle_make_model,
                lat: action.payload.lat,
                lng: action.payload.lng,
            },
        });
        const riderCheckinPayload: ActionTypes.ICreateRiderCheckinResponsePayload = {
            riderCheckin: res.data,
        };
        yield put(Actions.createRiderCheckinResponseAction(riderCheckinPayload));
    } catch (e) {
        yield put(Actions.createRiderCheckinResponseAction(e));
    }
}

function* fetchRiderCheckins() {
    const mapZoom = yield select(getMapZoom);
    const mapCenter = yield select(getMapCenter);
    const mapBounds = yield select(getMapBounds);
    const distance = getSearchDistance(mapZoom);
    const previousFetchInfo = yield select(getPreviousRiderCheckinFetchInfo);

    if (!shouldFetchRiderCheckins(previousFetchInfo, mapBounds)) {
        return;
    }

    try {
        const res = yield call(httpRequest, {
            url: Endpoints.GET_RIDER_CHECKINS,
            method: 'GET',
            params: {
                lat: mapCenter.lat,
                lng: mapCenter.lng,
                distance: distance,
            },
        });

        const riderCheckinsPayload: ActionTypes.IGetRiderCheckinsResponsePayload = {
            riderCheckins: res.data,
        };
        yield put(Actions.getRiderCheckinsResponseAction(riderCheckinsPayload));
        yield call(updateVisibleRiderCheckins);

        const riderCheckinFetchInfo: ActionTypes.IUpdateRiderCheckinFetchInfoPayload = {
            timestamp: getCurrentTimestamp(),
            bounds: mapBounds,
        };
        yield put(Actions.updateRiderCheckinFetchInfoAction(riderCheckinFetchInfo));
    } catch (e) {
        yield put(Actions.getRiderCheckinsResponseAction(e));
    }
}

function* updateRiderCheckin(action: Action<ActionTypes.IUpdateRiderCheckinRequestPayload>) {
    try {
        const res = yield call(httpRequest, {
            url: Endpoints.updateRiderCheckin(action.payload.id),
            method: 'PUT',
            data: {
                motorcycle_make_model: action.payload.motorcycle_make_model,
                expire_date: action.payload.expire_date,
            },
        });
        const riderCheckinPayload: ActionTypes.IUpdateRiderCheckinResponsePayload = {
            riderCheckin: res.data,
        };
        yield put(Actions.updateRiderCheckinResponseAction(riderCheckinPayload));
        yield put(Actions.setSelectedRiderCheckinAction({ riderCheckin: riderCheckinPayload.riderCheckin }));
    } catch (e) {
        yield put(Actions.updateRiderCheckinResponseAction(e));
    }
}

function* expireRiderCheckin(action: Action<ActionTypes.IExpireRiderCheckinRequestPayload>) {
    try {
        const res = yield call(httpRequest, {
            url: Endpoints.expireRiderCheckin(action.payload.id),
            method: 'DELETE',
        });
        const riderCheckinPayload: ActionTypes.IExpireRiderCheckinResponsePayload = {
            expiredRiderCheckin: res.data,
        };
        yield put(Actions.expireRiderCheckinResponseAction(riderCheckinPayload));
        yield call(updateVisibleRiderCheckins);
    } catch (e) {
        yield put(Actions.expireRiderCheckinResponseAction(e));
    }
}

function* updateVisibleRiderCheckins() {
    const riderCheckins = yield select(getRiderCheckins);
    const mapBounds = yield select(getMapBounds);
    const visibleRiderCheckins = getVisibleRiderCheckins(riderCheckins, mapBounds);
    const visibleRiderCheckinsPayload: ActionTypes.ISetVisibleRiderCheckinsPayload = {
        visibleRiderCheckins: visibleRiderCheckins,
    };
    yield put(Actions.setVisibleRiderCheckinsAction(visibleRiderCheckinsPayload));
}

function getVisibleRiderCheckins(riderCheckins: Types.RiderCheckin[], mapBounds: Types.MapBounds) {
    return riderCheckins.filter((rc) => {
        return (
            rc.lat < mapBounds.neLat &&
            rc.lat > mapBounds.swLat &&
            rc.lng < mapBounds.neLng &&
            rc.lng > mapBounds.swLng &&
            !currentDateIsAfter(rc.expireDate)
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

function shouldFetchRiderCheckins(
    previousFetchInfo: Types.RiderCheckinFetchInfo,
    currentMapBounds: Types.MapBounds,
): boolean {
    if (!previousFetchInfo) {
        return true;
    }

    const oneMinuteHasTranspired = currentTimeIsAfterTimePlusMinutes(previousFetchInfo.timestamp, 1);
    const previousBoundsContainsCurrentBounds = mapBoundsAContainsMapBoundsB(
        previousFetchInfo.bounds,
        currentMapBounds,
    );

    // If one minute has transpired or the previous map bounds doesn't contain
    // the current map bounds, return true.
    // ToDo: Determine a more accurate way to store and compare with previous search
    return oneMinuteHasTranspired || !previousBoundsContainsCurrentBounds;
}

function mapBoundsAContainsMapBoundsB(mapBoundsA: Types.MapBounds, mapBoundsB: Types.MapBounds): boolean {
    if (
        mapBoundsB.swLng > mapBoundsA.swLng &&
        mapBoundsB.swLat > mapBoundsA.swLat &&
        mapBoundsB.neLng < mapBoundsA.neLng &&
        mapBoundsB.neLat < mapBoundsA.neLat
    ) {
        return true;
    }
    return false;
}

export default function* watchRiderCheckinRequests() {
    yield all([
        takeLatest(ActionTypes.GET_RIDER_CHECKINS_REQUEST, fetchRiderCheckins),
        takeLatest(ActionTypes.UPDATE_VISIBLE_RIDER_CHECKINS, updateVisibleRiderCheckins),
        takeLatest(ActionTypes.CREATE_RIDER_CHECKIN_REQUEST, createRiderCheckin),
        takeLatest(ActionTypes.EXPIRE_RIDER_CHECKIN_REQUEST, expireRiderCheckin),
        takeLatest(ActionTypes.UPDATE_RIDER_CHECKIN_REQUEST, updateRiderCheckin),
    ]);
}

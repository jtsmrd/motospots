import { put, all, takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../ActionTypes';
import { updateVisibleRiderCheckinsAction, updateVisibleRiderMeetupsAction } from '../Actions';

function* mapBoundsUpdated() {
    yield put(updateVisibleRiderCheckinsAction({}));
    yield put(updateVisibleRiderMeetupsAction({}));
}

export default function* watchMapInfoSagas() {
    yield all([takeLatest(ActionTypes.UPDATE_MAP_BOUNDS, mapBoundsUpdated)]);
}

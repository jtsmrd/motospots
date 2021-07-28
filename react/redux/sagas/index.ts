import { all, fork } from 'redux-saga/effects';
import watchRiderCheckinRequests from './RiderCheckinSaga';
import watchMapInfoSagas from './MapInfoSaga';
import watchRiderMeetupRequests from './RiderMeetupSaga';

export function* rootSaga() {
    yield all([fork(watchRiderCheckinRequests), fork(watchMapInfoSagas), fork(watchRiderMeetupRequests)]);
}

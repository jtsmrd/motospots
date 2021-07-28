import { Action } from 'typescript-fsa';
import * as Types from '../Types';
import * as ActionTypes from '../ActionTypes';
import Cookie from 'js-cookie';
import { currentDateIsAfter } from '../../utilities/dateTimeUtils';

export interface IRiderCheckinState {
    riderCheckins: Types.RiderCheckin[];
    visibleRiderCheckins: Types.RiderCheckin[];
    userCheckin: Types.RiderCheckin;
    getCheckinsLoading: boolean;
    getCheckinsError: object;
    createCheckinLoading: boolean;
    createCheckinError: object;
    deleteCheckinLoading: boolean;
    deleteCheckinError: object;
    previousFetchInfo: Types.RiderCheckinFetchInfo;
    updateCheckinLoading: boolean;
    updateCheckinError: object;
}

export const initialState: IRiderCheckinState = {
    riderCheckins: [],
    visibleRiderCheckins: [],
    userCheckin: null,
    getCheckinsLoading: false,
    getCheckinsError: null,
    createCheckinLoading: false,
    createCheckinError: null,
    deleteCheckinLoading: false,
    deleteCheckinError: null,
    previousFetchInfo: null,
    updateCheckinLoading: false,
    updateCheckinError: null,
};

export const statePropName = 'riderCheckins';

export default function RiderCheckinReducer(
    state: IRiderCheckinState = initialState,
    action: Action<ActionTypes.IRiderCheckinActionsPayload>,
): IRiderCheckinState {
    switch (action.type) {
        case ActionTypes.GET_RIDER_CHECKINS_REQUEST: {
            return {
                ...state,
                getCheckinsLoading: true,
                getCheckinsError: null,
            };
        }
        case ActionTypes.GET_RIDER_CHECKINS_RESPONSE: {
            if (action.error) {
                return {
                    ...state,
                    getCheckinsError: action.payload,
                    getCheckinsLoading: false,
                };
            }
            const { riderCheckins } = action.payload as ActionTypes.IGetRiderCheckinsResponsePayload;
            return {
                ...state,
                riderCheckins: getActiveRiderCheckins(riderCheckins),
                userCheckin: getUserCheckin(riderCheckins),
                getCheckinsLoading: false,
                getCheckinsError: null,
            };
        }
        case ActionTypes.SET_VISIBLE_RIDER_CHECKINS: {
            const { visibleRiderCheckins } = action.payload as ActionTypes.ISetVisibleRiderCheckinsPayload;
            return { ...state, visibleRiderCheckins: visibleRiderCheckins };
        }
        case ActionTypes.CREATE_RIDER_CHECKIN_REQUEST: {
            return {
                ...state,
                createCheckinLoading: true,
                createCheckinError: null,
            };
        }
        case ActionTypes.CREATE_RIDER_CHECKIN_RESPONSE: {
            if (action.error) {
                return {
                    ...state,
                    createCheckinError: action.payload,
                    createCheckinLoading: false,
                };
            }
            const { riderCheckin } = action.payload as ActionTypes.ICreateRiderCheckinResponsePayload;
            return {
                ...state,
                userCheckin: riderCheckin,
                createCheckinLoading: false,
                createCheckinError: null,
            };
        }
        case ActionTypes.EXPIRE_RIDER_CHECKIN_REQUEST: {
            return { ...state, deleteCheckinLoading: true, deleteCheckinError: null };
        }
        case ActionTypes.EXPIRE_RIDER_CHECKIN_RESPONSE: {
            if (action.error) {
                return {
                    ...state,
                    deleteCheckinError: action.payload,
                    deleteCheckinLoading: false,
                };
            }
            const { expiredRiderCheckin } = action.payload as ActionTypes.IExpireRiderCheckinResponsePayload;
            return {
                ...state,
                userCheckin: null,
                riderCheckins: removeExpiredCheckin(state.riderCheckins, expiredRiderCheckin),
                deleteCheckinError: null,
                deleteCheckinLoading: false,
            };
        }
        case ActionTypes.REMOVE_EXPIRED_RIDER_CHECKINS: {
            return {
                ...state,
                riderCheckins: removeExpiredRiderCheckins(state.riderCheckins),
                visibleRiderCheckins: removeExpiredRiderCheckins(state.visibleRiderCheckins),
            };
        }
        case ActionTypes.UPDATE_RIDER_CHECKIN_FETCH_INFO: {
            const riderCheckinFetchInfo = action.payload as ActionTypes.IUpdateRiderCheckinFetchInfoPayload;
            return { ...state, previousFetchInfo: riderCheckinFetchInfo };
        }
        case ActionTypes.UPDATE_RIDER_CHECKIN_REQUEST: {
            return {
                ...state,
                updateCheckinLoading: true,
                updateCheckinError: null,
            };
        }
        case ActionTypes.UPDATE_RIDER_CHECKIN_RESPONSE: {
            if (action.error) {
                return {
                    ...state,
                    updateCheckinError: action.payload,
                    updateCheckinLoading: false,
                };
            }
            const { riderCheckin } = action.payload as ActionTypes.IUpdateRiderCheckinResponsePayload;
            return {
                ...state,
                userCheckin: riderCheckin,
                riderCheckins: updatedRiderCheckins(state.riderCheckins, riderCheckin),
                updateCheckinLoading: false,
                updateCheckinError: null,
            };
        }
    }
    return state;
}

function getActiveRiderCheckins(checkins: Types.RiderCheckin[]) {
    const userUUID = Cookie.get('user_uuid');
    return checkins.filter((checkin) => {
        return checkin.userUUID !== userUUID && !currentDateIsAfter(checkin.expireDate);
    });
}

function getUserCheckin(checkins: Types.RiderCheckin[]) {
    const userUUID = Cookie.get('user_uuid');
    const results = checkins.filter((checkin) => {
        return checkin.userUUID === userUUID && !currentDateIsAfter(checkin.expireDate);
    });
    return (results && results[0]) || null;
}

function removeExpiredRiderCheckins(checkins: Types.RiderCheckin[]) {
    return checkins.filter((checkin) => {
        return !currentDateIsAfter(checkin.expireDate);
    });
}

function updatedRiderCheckins(existingCheckins: Types.RiderCheckin[], updatedCheckin: Types.RiderCheckin) {
    const checkins = existingCheckins.filter((checkin) => {
        return checkin.id !== updatedCheckin.id;
    });
    return [...checkins, updatedCheckin];
}

function removeExpiredCheckin(existingCheckins: Types.RiderCheckin[], expiredRiderCheckin: Types.RiderCheckin) {
    return existingCheckins.filter((checkin) => {
        return checkin.id !== expiredRiderCheckin.id;
    });
}

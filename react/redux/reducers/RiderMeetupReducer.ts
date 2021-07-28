import { Action } from 'typescript-fsa';
import * as Types from '../Types';
import * as ActionTypes from '../ActionTypes';

export interface IRiderMeetupState {
    riderMeetups: Types.RiderMeetup[];
    visibleRiderMeetups: Types.RiderMeetup[];
    getMeetupsLoading: boolean;
    getMeetupsError: object;
    createMeetupLoading: boolean;
    createMeetupError: object;
    updateMeetupLoading: boolean;
    updateMeetupError: object;
    expireMeetupLoading: boolean;
    expireMeetupError: object;
}

export const initialState: IRiderMeetupState = {
    riderMeetups: [],
    visibleRiderMeetups: [],
    getMeetupsLoading: false,
    getMeetupsError: null,
    createMeetupLoading: false,
    createMeetupError: null,
    updateMeetupLoading: false,
    updateMeetupError: null,
    expireMeetupLoading: false,
    expireMeetupError: null,
};

export const statePropName = 'riderMeetups';

export default function RiderMeetupReducer(
    state: IRiderMeetupState = initialState,
    action: Action<ActionTypes.IRiderMeetupActionsPayload>,
): IRiderMeetupState {
    switch (action.type) {
        case ActionTypes.GET_RIDER_MEETUPS_REQUEST: {
            return {
                ...state,
                getMeetupsLoading: true,
                getMeetupsError: null,
            };
        }
        case ActionTypes.GET_RIDER_MEETUPS_RESPONSE: {
            if (action.error) {
                return {
                    ...state,
                    getMeetupsError: action.payload,
                    getMeetupsLoading: false,
                };
            }
            const { riderMeetups } = action.payload as ActionTypes.IGetRiderMeetupsResponsePayload;
            return {
                ...state,
                riderMeetups: riderMeetups,
                getMeetupsLoading: false,
                getMeetupsError: null,
            };
        }
        case ActionTypes.CREATE_RIDER_MEETUP_REQUEST: {
            return {
                ...state,
                createMeetupLoading: true,
                createMeetupError: null,
            };
        }
        case ActionTypes.CREATE_RIDER_MEETUP_RESPONSE: {
            if (action.error) {
                return {
                    ...state,
                    createMeetupError: action.payload,
                    createMeetupLoading: false,
                };
            }
            const { riderMeetup } = action.payload as ActionTypes.ICreateRiderMeetupResponsePayload;
            return {
                ...state,
                riderMeetups: [...state.riderMeetups, riderMeetup],
                createMeetupLoading: false,
                createMeetupError: null,
            };
        }
        case ActionTypes.UPDATE_RIDER_MEETUP_REQUEST: {
            return {
                ...state,
                updateMeetupLoading: true,
                updateMeetupError: null,
            };
        }
        case ActionTypes.UPDATE_RIDER_MEETUP_RESPONSE: {
            if (action.error) {
                return {
                    ...state,
                    updateMeetupError: action.payload,
                    updateMeetupLoading: false,
                };
            }
            const { riderMeetup } = action.payload as ActionTypes.IUpdateRiderMeetupResponsePayload;
            return {
                ...state,
                riderMeetups: updatedRiderMeetups(state.riderMeetups, riderMeetup),
                updateMeetupLoading: false,
                updateMeetupError: null,
            };
        }
        case ActionTypes.EXPIRE_RIDER_MEETUP_REQUEST: {
            return {
                ...state,
                expireMeetupLoading: true,
                expireMeetupError: null,
            };
        }
        case ActionTypes.EXPIRE_RIDER_MEETUP_RESPONSE: {
            if (action.error) {
                return {
                    ...state,
                    expireMeetupError: action.payload,
                    expireMeetupLoading: false,
                };
            }
            const { expiredRiderMeetup } = action.payload as ActionTypes.IExpireRiderMeetupResponsePayload;
            return {
                ...state,
                riderMeetups: removeExpiredMeetup(state.riderMeetups, expiredRiderMeetup),
                expireMeetupLoading: false,
                expireMeetupError: null,
            };
        }
        case ActionTypes.SET_VISIBLE_RIDER_MEETUPS: {
            const { visibleRiderMeetups } = action.payload as ActionTypes.ISetVisibleRiderMeetupsPayload;
            return { ...state, visibleRiderMeetups: visibleRiderMeetups };
        }
    }
    return state;
}

function updatedRiderMeetups(existingMeetups: Types.RiderMeetup[], updatedMeetup: Types.RiderMeetup) {
    const meetups = existingMeetups.filter((meetup) => {
        return meetup.id !== updatedMeetup.id;
    });
    return [...meetups, updatedMeetup];
}

function removeExpiredMeetup(existingMeetups: Types.RiderMeetup[], expiredRiderMeetup: Types.RiderMeetup) {
    return existingMeetups.filter((meetup) => {
        return meetup.id !== expiredRiderMeetup.id;
    });
}

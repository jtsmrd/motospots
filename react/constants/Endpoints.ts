//<editor-fold desc="RiderCheckin Endpoints">

import { formatString } from '../utilities/stringUtils';

export const CREATE_RIDER_CHECKIN = '/api/rider_checkin';
export const GET_RIDER_CHECKINS = '/api/rider_checkins';
const UPDATE_RIDER_CHECKIN = '/api/rider_checkin/%s1';
const EXPIRE_RIDER_CHECKIN = '/api/rider_checkin/%s1';

export function updateRiderCheckin(id: number): string {
    return formatString(UPDATE_RIDER_CHECKIN, id);
}

export function expireRiderCheckin(id: number): string {
    return formatString(EXPIRE_RIDER_CHECKIN, id);
}

//</editor-fold>

//<editor-fold desc="RiderMeetup Endpoints">

export const CREATE_RIDER_MEETUP = '/api/rider_meetup';
export const GET_RIDER_MEETUPS = '/api/rider_meetups';
const UPDATE_RIDER_MEETUP = '/api/rider_meetup/%s1';
const EXPIRE_RIDER_MEETUP = '/api/rider_meetup/%s1';

export function updateRiderMeetup(id: number): string {
    return formatString(UPDATE_RIDER_MEETUP, id);
}

export function expireRiderMeetup(id: number): string {
    return formatString(EXPIRE_RIDER_MEETUP, id);
}

//</editor-fold>

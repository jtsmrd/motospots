// TODO: Change expireDate back to string after getting global string extensions to work
export interface RiderCheckin {
    id: number;
    userUUID: string;
    createDate: any;
    expireDate: any;
    motorcycleMakeModel?: string;
    lat: number;
    lng: number;
}
// TODO: Change meetupDate and rideStartDate back to strings after getting global string extensions to work
export interface RiderMeetup {
    id: number;
    userUUID: string;
    createDate: string;
    expireDate: string;
    meetupDate: any;
    rideStartDate: any;
    title: string;
    description?: string;
    lat: number;
    lng: number;
}

export interface MapBounds {
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
}

export interface MapCenter {
    lat: number;
    lng: number;
}

export interface MapCoords {
    lat: number;
    lng: number;
}

export interface RiderCheckinFetchInfo {
    timestamp: number;
    bounds: MapBounds;
}

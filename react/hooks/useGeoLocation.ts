import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';

export const useGeoLocation = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [error, setError] = useState(null);

    const locationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    const locationSuccess = (position) => {
        setCurrentLocation(position.coords);
    };

    const locationError = (error) => {
        setError('Location unavailable, please check your location settings.');
        Sentry.captureException(`Location error: ${error?.message}`);
    };

    useEffect(() => {
        console.log('navigator', navigator);
        if (!navigator?.geolocation) {
            setError('Geolocation is not supported');
            return;
        }

        navigator?.geolocation?.getCurrentPosition(locationSuccess, locationError, locationOptions);

        // navigator?.permissions?.query({ name: 'geolocation' }).then(function (result) {
        //     if (result.state === 'granted') {
        //         navigator?.geolocation?.getCurrentPosition(locationSuccess);
        //     } else if (result.state === 'prompt') {
        //         navigator?.geolocation?.getCurrentPosition(locationSuccess, locationError, locationOptions);
        //     } else if (result.state === 'denied') {
        //         setError('Geolocation is not enabled');
        //     }
        // });
    }, []);

    return {
        geoLocationLat: currentLocation?.latitude,
        geoLocationLng: currentLocation?.longitude,
        geoLocationError: error,
    };
};

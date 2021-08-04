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
        if (!navigator?.geolocation) {
            setError('Geolocation is not supported');
            return;
        }

        navigator?.geolocation?.getCurrentPosition(locationSuccess, locationError, locationOptions);
    }, []);

    return {
        geoLocationLat: currentLocation?.latitude,
        geoLocationLng: currentLocation?.longitude,
        geoLocationError: error,
    };
};

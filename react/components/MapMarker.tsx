import React from 'react';
import { Marker } from 'google-maps-react';

export interface MapMarkerProps {
    lat: number;
    lng: number;
    svgPath: string;
    color: string;
    key: number;
    onClick: any;
}
const MapMarker: React.FC<MapMarkerProps> = (props) => {
    const { lat, lng, svgPath, color, key, onClick } = props;

    return (
        <Marker
            key={key}
            // @ts-ignore
            position={{ lat: lat, lng: lng }}
            icon={{
                path: svgPath,
                scale: 1,
                fillColor: color,
                fillOpacity: 0.8,
                rotation: 0,
            }}
            onClick={onClick}
            {...props}
        />
    );
};

export default MapMarker;

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapRoute = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [sourceName, setSourceName] = useState('');
    const [destinationName, setDestinationName] = useState('');
    const [sourceCoords, setSourceCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const sourceMarker = useRef(null);
    const destinationMarker = useRef(null);
    const carpoolMarker = useRef(null);

    const getCoordinates = async (place) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${mapboxgl.accessToken}`
            );
            const data = await response.json();
            return data.features[0].center;
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            return null;
        }
    };

    const getRoute = async () => {
        try {
            const query = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCoords[0]},${sourceCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
            );
            const json = await query.json();
            const data = json.routes[0];
            return {
                type: 'Feature',
                properties: {},
                geometry: data.geometry
            };
        } catch (error) {
            console.error("Error fetching route:", error);
            return null;
        }
    };

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [72.8777, 19.0760], // Default center (Mumbai) before plotting any route
            zoom: 12
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
            map.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: []
                    }
                }
            });

            map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#2563eb',
                    'line-width': 4,
                    'line-opacity': 0.8
                }
            });

            setMapLoaded(true);
        });

        return () => map.current?.remove();
    }, []);

    const updateMarkers = (carpoolCoords) => {
        if (sourceMarker.current) sourceMarker.current.remove();
        if (destinationMarker.current) destinationMarker.current.remove();
        if (carpoolMarker.current) carpoolMarker.current.remove();

        sourceMarker.current = new mapboxgl.Marker({ color: '#2563eb' })
            .setLngLat(sourceCoords)
            .setPopup(new mapboxgl.Popup().setHTML(
                '<div class="p-2"><h3 class="font-bold">Your Location</h3></div>'
            ))
            .addTo(map.current);

        destinationMarker.current = new mapboxgl.Marker({ color: '#ef4444' })
            .setLngLat(destinationCoords)
            .setPopup(new mapboxgl.Popup().setHTML(
                `<div class="p-2"><h3 class="font-bold">${destinationName}</h3></div>`
            ))
            .addTo(map.current);

        carpoolMarker.current = new mapboxgl.Marker({ color: '#22c55e' })
            .setLngLat(carpoolCoords)
            .setPopup(new mapboxgl.Popup().setHTML(
                '<div class="p-2"><h3 class="font-bold">Soham\'s Location</h3><p class="text-sm text-gray-600">(10 min walk)</p></div>'
            ))
            .addTo(map.current);
    };

    useEffect(() => {
        if (!mapLoaded || !sourceCoords || !destinationCoords) return;

        const displayRoute = async () => {
            const routeData = await getRoute();
            if (routeData && map.current.getSource('route')) {
                map.current.getSource('route').setData(routeData);

                const coordinates = routeData.geometry.coordinates;
                const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                map.current.fitBounds(bounds, { padding: 50 });

                const carpoolCoords = coordinates[Math.floor(coordinates.length * 0.1)]; // 10% along the path
                updateMarkers(carpoolCoords);
            }
        };

        displayRoute();
    }, [mapLoaded, sourceCoords, destinationCoords]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sourceLocation = await getCoordinates(sourceName);
        const destinationLocation = await getCoordinates(destinationName);

        if (sourceLocation && destinationLocation) {
            setSourceCoords(sourceLocation);
            setDestinationCoords(destinationLocation);
        } else {
            console.error("Error fetching coordinates for input locations");
        }
    };

    return (
        <div className="w-screen h-screen relative">
            <form onSubmit={handleSubmit} className="absolute z-10 p-4 bg-white shadow-lg rounded-lg top-4 left-4">
                <input
                    type="text"
                    placeholder="Enter Source"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="p-2 border rounded mr-2"
                />
                <input
                    type="text"
                    placeholder="Enter Destination"
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    className="p-2 border rounded mr-2"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Get Route
                </button>
            </form>
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
};

export default MapRoute;

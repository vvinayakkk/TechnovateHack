import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Car, MapPin } from 'lucide-react';

// Replace with your Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MumbaiCarpooling = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [activeRouteId, setActiveRouteId] = useState(null);
    const markersRef = useRef([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Sample routes data
    const routes = [
        {
            id: 1,
            rider1: {
                name: "Priya",
                location: [72.856, 19.017],
                label: "Dadar"
            },
            rider2: {
                name: "Rahul",
                location: [72.845, 19.033],
                label: "Mahim"
            },
            destination: {
                location: [72.868, 19.069],
                label: "BKC"
            }
        },
        {
            id: 2,
            rider1: {
                name: "Amit",
                location: [72.915, 19.129],
                label: "Powai"
            },
            rider2: {
                name: "Sneha",
                location: [72.902, 19.114],
                label: "Vikhroli"
            },
            destination: {
                location: [72.847, 19.119],
                label: "Andheri"
            }
        }
    ];

    // Initialize map
    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [72.8777, 19.0760], // Mumbai
            zoom: 11
        });

        // Add navigation control
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Wait for map to load before adding sources and layers
        map.current.on('load', () => {
            // Initialize sources and layers for each route
            routes.forEach(route => {
                // Add source
                map.current.addSource(`route-${route.id}`, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: { active: false },
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                route.rider1.location,
                                route.rider2.location,
                                route.destination.location
                            ]
                        }
                    }
                });

                // Add layer
                map.current.addLayer({
                    id: `route-${route.id}`,
                    type: 'line',
                    source: `route-${route.id}`,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#2563eb',
                        'line-width': 2,
                        'line-opacity': 0.4
                    }
                });
            });

            setMapLoaded(true);
        });

        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, []);

    // Update markers and route styles
    useEffect(() => {
        if (!mapLoaded) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Update routes and add markers
        routes.forEach(route => {
            const isActive = route.id === activeRouteId;

            // Update route style
            if (map.current.getSource(`route-${route.id}`)) {
                map.current.setPaintProperty(`route-${route.id}`, 'line-width',
                    isActive ? 4 : 2
                );
                map.current.setPaintProperty(`route-${route.id}`, 'line-opacity',
                    isActive ? 0.8 : 0.4
                );
            }

            // Add markers for pickup points
            const rider1Marker = new mapboxgl.Marker({ color: '#22c55e' })
                .setLngLat(route.rider1.location)
                .setPopup(
                    new mapboxgl.Popup().setHTML(
                        `<div class="p-2">
                            <h3 class="font-bold">${route.rider1.label}</h3>
                            <p>Rider: ${route.rider1.name}</p>
                        </div>`
                    )
                )
                .addTo(map.current);

            const rider2Marker = new mapboxgl.Marker({ color: '#22c55e' })
                .setLngLat(route.rider2.location)
                .setPopup(
                    new mapboxgl.Popup().setHTML(
                        `<div class="p-2">
                            <h3 class="font-bold">${route.rider2.label}</h3>
                            <p>Rider: ${route.rider2.name}</p>
                        </div>`
                    )
                )
                .addTo(map.current);

            // Add marker for destination
            const destMarker = new mapboxgl.Marker({ color: '#ef4444' })
                .setLngLat(route.destination.location)
                .setPopup(
                    new mapboxgl.Popup().setHTML(
                        `<div class="p-2">
                            <h3 class="font-bold">${route.destination.label}</h3>
                            <p>Destination</p>
                        </div>`
                    )
                )
                .addTo(map.current);

            markersRef.current.push(rider1Marker, rider2Marker, destMarker);
        });
    }, [activeRouteId, mapLoaded]);

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Mumbai Carpooling Routes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {/* Map Container */}
                    <div
                        ref={mapContainer}
                        className="w-full h-[500px] rounded-lg mb-4"
                    />

                    {/* Legend */}
                    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span className="text-sm">Pickup Points</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span className="text-sm">Destinations</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-1 bg-blue-600"></div>
                            <span className="text-sm">Route</span>
                        </div>
                    </div>
                </div>

                {/* Routes List */}
                <div className="mt-4 space-y-2">
                    <h3 className="font-semibold">Available Routes:</h3>
                    {routes.map((route) => (
                        <div
                            key={route.id}
                            onClick={() => setActiveRouteId(route.id === activeRouteId ? null : route.id)}
                            className={`p-4 rounded-lg cursor-pointer transition-colors ${activeRouteId === route.id ? 'bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Car className="w-5 h-5" />
                                <span>
                                    {route.rider1.label} → {route.rider2.label} → {route.destination.label}
                                </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600 pl-7">
                                Riders: {route.rider1.name} and {route.rider2.name}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default MumbaiCarpooling;
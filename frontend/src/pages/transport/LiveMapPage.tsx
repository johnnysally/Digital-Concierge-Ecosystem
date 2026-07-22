import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { getActiveVehicles, getActiveTrips, getTripRoute } from '../../api/transport/mapApi';
import { api } from '../../api/axios';

const containerStyle = { width: '100%', height: '600px' };
const defaultCenter = { lat: -1.2921, lng: 36.8219 }; // Nairobi

const LiveMapPage = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [selectedTrip, setSelectedTrip] = useState<any>(null);
    const [directions, setDirections] = useState<any>(null);
    const [googleMapsKey, setGoogleMapsKey] = useState('');

    useEffect(() => {
        api.get('/public/config').then((res) => {
            setGoogleMapsKey(res.data.config?.google_maps_api_key || '');
        }).catch(() => {});

        Promise.all([getActiveVehicles(), getActiveTrips()])
            .then(([v, t]) => { setVehicles(v.vehicles || []); setTrips(t.rides || []); })
            .finally(() => setLoading(false));

        const interval = setInterval(() => {
            getActiveVehicles().then(v => setVehicles(v.vehicles || [])).catch(() => {});
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleTripSelect = async (trip: any) => {
        setSelectedTrip(trip);
        setSelectedVehicle(null);
        if (trip.pickup?.coordinates && trip.dropoff?.coordinates) {
            const directionsService = new google.maps.DirectionsService();
            const result = await directionsService.route({
                origin: { lat: trip.pickup.coordinates[1], lng: trip.pickup.coordinates[0] },
                destination: { lat: trip.dropoff.coordinates[1], lng: trip.dropoff.coordinates[0] },
                travelMode: google.maps.TravelMode.DRIVING,
            });
            setDirections(result);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            available: '#10b981', dispatched: '#0ea5e9', en_route: '#f59e0b',
            arrived: '#8b5cf6', in_service: '#ef4444', completed: '#64748b',
        };
        return colors[status] || '#64748b';
    };

    const getVehicleIcon = (status: string) => ({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: getStatusColor(status),
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
    });

    if (loading) return <div className="p-8 text-slate-400">Loading fleet data...</div>;
 {!googleMapsKey && (
    <div className="rounded-3xl border border-amber-800 bg-amber-950/50 p-8 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-amber-400">Google Maps Not Configured</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            The Google Maps API key has not been set. Please contact your platform administrator to configure it.
        </p>
        <p className="mt-1 text-xs text-slate-500">
            Administrator: Go to <strong>Settings → Integrations → Google Maps API Key</strong>
        </p>
    </div>
)}
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Live Map</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Real-time fleet map</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">
                    {vehicles.length} active vehicles · {trips.length} ongoing trips
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                <div className="rounded-3xl border border-slate-800 overflow-hidden">
                    <LoadScript googleMapsApiKey={googleMapsKey}>
                        <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={13}
                            options={{ styles: [{ featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] }, { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] }] }}>
                            
                            {vehicles.map((v) => v.location?.coordinates && (
                                <Marker key={v._id}
                                    position={{ lat: v.location.coordinates[1], lng: v.location.coordinates[0] }}
                                    icon={getVehicleIcon(v.dispatchStatus || v.status)}
                                    onClick={() => { setSelectedVehicle(v); setSelectedTrip(null); setDirections(null); }}
                                />
                            ))}

                            {trips.map((t) => t.pickup?.coordinates && (
                                <Marker key={`pickup-${t._id}`}
                                    position={{ lat: t.pickup.coordinates[1], lng: t.pickup.coordinates[0] }}
                                    icon={{ path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, scale: 5, fillColor: '#3b82f6', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 1 }}
                                />
                            ))}

                            {selectedVehicle && selectedVehicle.location?.coordinates && (
                                <InfoWindow position={{ lat: selectedVehicle.location.coordinates[1], lng: selectedVehicle.location.coordinates[0] }} onCloseClick={() => setSelectedVehicle(null)}>
                                    <div className="text-sm p-1">
                                        <p className="font-semibold">{selectedVehicle.make} {selectedVehicle.model}</p>
                                        <p className="text-slate-500">{selectedVehicle.plateNumber}</p>
                                        <p className="text-slate-500 capitalize">{(selectedVehicle.dispatchStatus || selectedVehicle.status).replace('_', ' ')}</p>
                                        {selectedVehicle.driver && <p className="text-slate-500">🚗 {selectedVehicle.driver.firstName}</p>}
                                    </div>
                                </InfoWindow>
                            )}

                            {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#3b82f6', strokeWeight: 3 } }} />}
                        </GoogleMap>
                    </LoadScript>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Active Trips ({trips.length})</h3>
                        {trips.map((trip) => (
                            <div key={trip._id} onClick={() => handleTripSelect(trip)}
                                className={`rounded-xl border p-3 mb-2 cursor-pointer transition-colors ${selectedTrip?._id === trip._id ? 'border-sky-500 bg-sky-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">{trip.vehicle?.plateNumber || 'Unassigned'}</span>
                                    <span className="text-xs text-emerald-400 capitalize">{trip.status.replace('_', ' ')}</span>
                                </div>
                                <p className="text-xs text-white mt-1">{trip.customer?.firstName} {trip.customer?.lastName}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{trip.pickup?.address?.substring(0, 30)} → {trip.dropoff?.address?.substring(0, 30)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Fleet ({vehicles.length})</h3>
                        {vehicles.map((v) => (
                            <div key={v._id} onClick={() => { setSelectedVehicle(v); setSelectedTrip(null); setDirections(null); }}
                                className={`rounded-xl border p-3 mb-2 cursor-pointer transition-colors ${selectedVehicle?._id === v._id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white font-medium">{v.plateNumber}</span>
                                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(v.dispatchStatus || v.status) }} />
                                </div>
                                <p className="text-xs text-slate-400">{v.make} {v.model} · {v.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveMapPage;
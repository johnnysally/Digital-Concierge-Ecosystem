const axios = require('axios');
const PlatformSettings = require('../models/admin/PlatformSettings');
const logger = require('../utils/logger');

const getGoogleMapsKey = async () => {
    try {
        const setting = await PlatformSettings.findOne({ key: 'google_maps_api_key' });
        return setting?.value || null;
    } catch (e) {
        return null;
    }
};

const getGoogleDistance = async (origin, destination) => {
    try {
        const apiKey = await getGoogleMapsKey();
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            logger.warn('Google Maps API key not configured');
            return { success: false, error: 'API key not configured' };
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: { origins: origin, destinations: destination, key: apiKey, units: 'metric' },
            timeout: 5000,
        });

        const data = response.data;
        if (data.status !== 'OK') return { success: false, error: data.status };

        const element = data.rows[0]?.elements[0];
        if (!element || element.status !== 'OK') return { success: false, error: element?.status || 'NO_ROUTE' };

        const distanceKm = element.distance.value / 1000;
        const durationMinutes = Math.ceil(element.duration.value / 60);

        logger.info(`Google Maps: ${origin} → ${destination} = ${distanceKm.toFixed(2)} km`);
        return { success: true, distanceKm, durationMinutes };
    } catch (error) {
        logger.error(`Google Maps API failed: ${error.message}`);
        return { success: false, error: error.message };
    }
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const parseCoords = (input) => {
    if (!input) return null;
    const parts = input.split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { lat: parts[0], lng: parts[1] };
    }
    return null;
};

const calculateDistance = async ({ from, to, pickupCoords, dropoffCoords, manualDistance, pricePerKm = 0, baseFare = 0 }) => {
    const result = { distanceKm: 0, durationMinutes: 0, estimatedTotal: 0, method: 'unknown' };

    const googleResult = await getGoogleDistance(from, to);
    if (googleResult.success) {
        result.distanceKm = googleResult.distanceKm;
        result.durationMinutes = googleResult.durationMinutes;
        result.method = 'google_maps';
        result.estimatedTotal = baseFare + (result.distanceKm * pricePerKm);
        return result;
    }

    const origin = parseCoords(pickupCoords);
    const dest = parseCoords(dropoffCoords);

    if (origin && dest) {
        const straightDistance = haversineDistance(origin.lat, origin.lng, dest.lat, dest.lng);
        result.distanceKm = straightDistance * 1.3;
        result.method = 'haversine';
        result.estimatedTotal = baseFare + (result.distanceKm * pricePerKm);
        logger.info(`Haversine: ${straightDistance.toFixed(2)} km × 1.3 = ${result.distanceKm.toFixed(2)} km`);
        return result;
    }

    if (manualDistance && manualDistance > 0) {
        result.distanceKm = manualDistance;
        result.method = 'manual';
        result.estimatedTotal = baseFare + (manualDistance * pricePerKm);
        return result;
    }

    result.method = 'failed';
    result.error = 'Could not calculate distance. Provide coordinates or manual distance.';
    return result;
};

module.exports = { calculateDistance, getGoogleDistance, haversineDistance };
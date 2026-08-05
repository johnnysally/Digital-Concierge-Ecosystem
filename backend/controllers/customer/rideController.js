const Ride = require('../../models/transport/Ride');
const Vehicle = require('../../models/transport/Vehicle');
const TransportPartner = require('../../models/transport/TransportPartner');
const { partner: partnerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const calculateDistance = (pickup, dropoff) => {
    if (pickup?.coordinates?.length === 2 && dropoff?.coordinates?.length === 2) {
        const [lon1, lat1] = pickup.coordinates;
        const [lon2, lat2] = dropoff.coordinates;
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return Math.round(R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
    }
    return 5;
};

const createRide = async (req, res, next) => {
    try {
        const { vehicleId, pickup, dropoff, rideType, scheduledTime, customerPhone } = req.body;

        if (!vehicleId || !pickup || !dropoff) return res.status(400).json({ success: false, message: 'Vehicle, pickup and dropoff required.' });
        if (!pickup.address || !dropoff.address) return res.status(400).json({ success: false, message: 'Pickup and dropoff addresses required.' });
        if (rideType === 'scheduled' && !scheduledTime) return res.status(400).json({ success: false, message: 'Scheduled time required.' });

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        if (vehicle.status !== 'available') return res.status(400).json({ success: false, message: 'Vehicle not available.' });

        const distance = calculateDistance(pickup, dropoff);
        const distanceFare = vehicle.pricePerKm * distance;
        const timeFare = (vehicle.pricePerMin || 0) * Math.round(distance * 2);
        const total = Math.round((vehicle.baseFare || 0 + distanceFare + timeFare) * 100) / 100;

        const ride = await Ride.create({
            partner: vehicle.partner, vehicle: vehicleId, customer: req.user._id,
            pickup, dropoff, rideType: rideType || 'immediate', scheduledTime: scheduledTime || null,
            status: 'confirmed', paymentStatus: 'paid', distance,
            fare: { base: vehicle.baseFare || 0, distance: distanceFare, time: timeFare, total, currency: 'KES' },
        });

        await Vehicle.findByIdAndUpdate(vehicleId, { status: 'on_trip', dispatchStatus: 'dispatched' });

        const customerName = `${req.user.firstName} ${req.user.lastName}`;
        const vehicleName = `${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`;

     createNotification({
    partnerId: partner._id.toString(),
    type: 'transport',
    title: 'New Ride Request',
    message: customerName + ' requested a ride. ' + pickup.address + ' to ' + dropoff.address + '.',
}).catch(e => logger.error('Partner notification failed: ' + e.message));

        const partner = await TransportPartner.findById(vehicle.partner);
        if (partner) {
            partnerEmails.sendNewRide(partner, {
                id: ride._id, customerName, vehicleName, rideType: rideType || 'immediate',
                pickup: pickup.address, dropoff: dropoff.address, distance, total,
                phone: customerPhone || req.user.phone || '', scheduledTime,
            }).catch(e => logger.error(`Partner notification failed: ${e.message}`));
        }

        res.status(201).json({ success: true, ride });
    } catch (error) { next(error); }
};

const getMyRides = async (req, res, next) => {
    try {
        const rides = await Ride.find({ customer: req.user._id }).populate('vehicle', 'make model plateNumber type').sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, rides });
    } catch (error) { next(error); }
};

module.exports = { createRide, getMyRides };
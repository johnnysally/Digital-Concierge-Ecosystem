const Ride = require('../../models/transport/Ride');
const Vehicle = require('../../models/transport/Vehicle');
const TransportPartner = require('../../models/transport/TransportPartner');
const { customer: customerEmails, partner: partnerEmails } = require('../../services/emailService');
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
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10;
    }
    return 5;
};

const createRide = async (req, res, next) => {
    try {
        const { vehicleId, pickup, dropoff, rideType, scheduledTime, customerPhone } = req.body;

        if (!vehicleId || !pickup || !dropoff) {
            return res.status(400).json({ success: false, message: 'Vehicle, pickup and dropoff are required.' });
        }

        if (!pickup.address || !dropoff.address) {
            return res.status(400).json({ success: false, message: 'Pickup and dropoff addresses are required.' });
        }

        if (rideType === 'scheduled' && !scheduledTime) {
            return res.status(400).json({ success: false, message: 'Scheduled time is required for scheduled rides.' });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        if (vehicle.status !== 'available') return res.status(400).json({ success: false, message: 'Vehicle is not available.' });

        const distance = calculateDistance(pickup, dropoff);
        const distanceFare = vehicle.pricePerKm * distance;
        const timeFare = (vehicle.pricePerMin || 0) * Math.round(distance * 2);
        const baseFare = vehicle.baseFare || 0;
        const total = Math.round((baseFare + distanceFare + timeFare) * 100) / 100;

        const ride = await Ride.create({
            partner: vehicle.partner,
            vehicle: vehicleId,
            customer: req.user._id,
            pickup,
            dropoff,
            rideType: rideType || 'immediate',
            scheduledTime: scheduledTime || null,
            status: 'requested',
            fare: { base: baseFare, distance: distanceFare, time: timeFare, total, currency: 'KES' },
            distance,
        });

        await Vehicle.findByIdAndUpdate(vehicleId, { status: 'on_trip', dispatchStatus: 'dispatched' });

        const customerName = `${req.user.firstName} ${req.user.lastName}`;
        const vehicleName = `${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`;

        customerEmails.sendRideConfirmed(req.user, {
            vehicleName,
            rideType: rideType || 'immediate',
            pickup: pickup.address,
            dropoff: dropoff.address,
            distance,
            total,
            phone: customerPhone || req.user.phone || 'N/A',
            scheduledTime,
        }).catch(e => logger.error(`Ride confirmation email failed: ${e.message}`));

        createNotification({
            customerId: req.user._id,
            type: 'transport',
            title: 'Ride Booked',
            message: `Your ${vehicle.type} ride has been booked. Est. fare: KES ${total}.`,
        }).catch(e => logger.error(`Notification failed: ${e.message}`));

        const partner = await TransportPartner.findById(vehicle.partner);
        if (partner) {
            partnerEmails.sendNewRide(partner, {
                id: ride._id,
                customerName,
                vehicleName,
                rideType: rideType || 'immediate',
                pickup: pickup.address,
                dropoff: dropoff.address,
                distance,
                total,
                phone: customerPhone || req.user.phone || 'N/A',
                scheduledTime,
            }).catch(e => logger.error(`Transport partner notification email failed: ${e.message}`));
        }

        res.status(201).json({ success: true, ride });
    } catch (error) { next(error); }
};

const getMyRides = async (req, res, next) => {
    try {
        const rides = await Ride.find({ customer: req.user._id })
            .populate('vehicle', 'make model plateNumber type')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, rides });
    } catch (error) { next(error); }
};

module.exports = { createRide, getMyRides };
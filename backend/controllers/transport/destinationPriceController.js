const DestinationPrice = require('../../models/transport/DestinationPrice');
const Vehicle = require('../../models/transport/Vehicle');
const { calculateDistance } = require('../../services/distanceService');
const logger = require('../../utils/logger');

const create = async (req, res, next) => {
    try {
        const dp = await DestinationPrice.create({ ...req.body, partner: req.user._id });
        res.status(201).json({ success: true, destinationPrice: dp });
    } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
    try {
        const prices = await DestinationPrice.find({ partner: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, destinationPrices: prices });
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const dp = await DestinationPrice.findOneAndUpdate(
            { _id: req.params.id, partner: req.user._id },
            req.body,
            { new: true }
        );
        if (!dp) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, destinationPrice: dp });
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    try {
        const dp = await DestinationPrice.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!dp) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (error) { next(error); }
};

const calculateFare = async (req, res, next) => {
    try {
        const { from, to, vehicleType, pickupCoords, dropoffCoords, manualDistance } = req.body;

        if (!from || !to) {
            return res.status(400).json({ success: false, message: 'From and To locations are required' });
        }

        const fixedPrice = await DestinationPrice.findOne({
            $or: [
                { from: { $regex: new RegExp(from, 'i') }, to: { $regex: new RegExp(to, 'i') } },
                { from: { $regex: new RegExp(to, 'i') }, to: { $regex: new RegExp(from, 'i') } },
            ],
            isActive: true,
            vehicleType: { $in: [vehicleType || 'all', 'all'] },
        }).sort({ price: 1 });

        if (fixedPrice) {
            logger.info(`Fixed price: ${from} → ${to} = ${fixedPrice.price}`);
            return res.json({
                success: true,
                fare: {
                    type: 'fixed',
                    price: fixedPrice.price,
                    from: fixedPrice.from,
                    to: fixedPrice.to,
                    distanceKm: fixedPrice.estimatedDistance || null,
                    durationMinutes: fixedPrice.estimatedDuration || null,
                    departureTimes: fixedPrice.departureTimes || [],
                    method: 'destination_price',
                },
            });
        }

        const vehicleQuery = {
            availability: 'online',
            status: { $ne: 'maintenance' },
            $or: [
                { type: { $nin: ['van', 'bus'] }, status: 'idle' },
                { type: { $in: ['van', 'bus'] }, availableSeats: { $gt: 0 } },
            ],
        };
        if (vehicleType) vehicleQuery.type = vehicleType;

        const vehicle = await Vehicle.findOne(vehicleQuery).sort({ pricePerKm: 1 });

        if (!vehicle) {
            return res.json({ success: false, message: 'No available vehicles found' });
        }

        const pricePerKm = vehicle.pricePerKm || 0;
        const baseFare = vehicle.baseFare || 0;

        const distanceResult = await calculateDistance({
            from,
            to,
            pickupCoords,
            dropoffCoords,
            manualDistance,
            pricePerKm,
            baseFare,
        });

        if (distanceResult.method === 'failed') {
            return res.json({ success: false, message: distanceResult.error });
        }

        res.json({
            success: true,
            fare: {
                type: 'dynamic',
                distanceKm: distanceResult.distanceKm,
                durationMinutes: distanceResult.durationMinutes || null,
                pricePerKm,
                baseFare,
                estimatedTotal: distanceResult.estimatedTotal,
                method: distanceResult.method,
                vehicleId: vehicle._id,
            },
        });
    } catch (error) { next(error); }
};

module.exports = { create, getAll, update, remove, calculateFare };
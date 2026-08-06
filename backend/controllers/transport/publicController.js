const Vehicle = require('../../models/transport/Vehicle');
const DestinationPrice = require('../../models/transport/DestinationPrice');
const TransportPartner = require('../../models/transport/TransportPartner');
const { calculateDistance } = require('../../services/distanceService');
const logger = require('../../utils/logger');

const searchVehicles = async (req, res, next) => {
    try {
        const { type, isLongDistance, town } = req.query;
        const query = {
            availability: 'online',
            status: { $ne: 'maintenance' },
            $or: [
                { isLongDistance: false, status: 'idle' },
                { isLongDistance: true, availableSeats: { $gt: 0 } },
            ],
        };
        if (type) query.type = type;
        if (town) {
            const partners = await TransportPartner.find({ towns: town, isVerified: true, isActive: true }).select('_id');
            query.partner = { $in: partners.map(p => p._id) };
        }
        const vehicles = await Vehicle.find(query).populate('partner', 'businessName phone email supportPhone supportEmail').sort({ pricePerKm: 1 }).limit(20);
        res.json({ success: true, vehicles });
    } catch (error) { next(error); }
};

const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({
            _id: req.params.id, availability: 'online', status: { $ne: 'maintenance' },
            $or: [{ isLongDistance: false, status: 'idle' }, { isLongDistance: true, availableSeats: { $gt: 0 } }],
        }).populate('partner', 'businessName phone email supportPhone supportEmail');
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

const normalizeStr = (str) => (str || '').toLowerCase().trim();

const calculatePublicFare = async (req, res, next) => {
    try {
        const { from, to, vehicleType, pickupCoords, dropoffCoords, manualDistance, seats, town, partner } = req.body;
        if (!from || !to) return res.status(400).json({ success: false, message: 'From and To locations are required' });

        const isLongDistance = vehicleType && ['van', 'bus'].includes(vehicleType);
        const seatMultiplier = isLongDistance && seats ? seats : 1;

        const partnerFilter = {};
        if (partner) {
            partnerFilter.partner = partner;
        } else if (town) {
            const partners = await TransportPartner.find({ towns: town, isVerified: true, isActive: true }).select('_id');
            partnerFilter.partner = { $in: partners.map(p => p._id) };
        }

        const priceQuery = {
            $or: [
                { from: { $regex: new RegExp(from, 'i') }, to: { $regex: new RegExp(to, 'i') } },
                { from: { $regex: new RegExp(to, 'i') }, to: { $regex: new RegExp(from, 'i') } },
            ],
            isActive: true,
            ...partnerFilter,
        };

        let fixedPrice = await DestinationPrice.findOne(priceQuery).sort({ price: 1 });

        if (!fixedPrice) {
            const fromRoutes = await DestinationPrice.find({
                $or: [
                    { from: { $regex: new RegExp(from, 'i') } },
                    { to: { $regex: new RegExp(from, 'i') } },
                ],
                isActive: true,
                ...partnerFilter,
            });

            const toRoutes = await DestinationPrice.find({
                $or: [
                    { from: { $regex: new RegExp(to, 'i') } },
                    { to: { $regex: new RegExp(to, 'i') } },
                ],
                isActive: true,
                ...partnerFilter,
            });

            let bestLeg = null;
            let bestTotal = Infinity;

            for (const fr of fromRoutes) {
                const frPoint = normalizeStr(fr.from) === normalizeStr(from) ? fr.to : fr.from;
                for (const tr of toRoutes) {
                    const trPoint = normalizeStr(tr.from) === normalizeStr(to) ? tr.to : tr.from;
                    if (normalizeStr(frPoint) === normalizeStr(trPoint)) {
                        const total = fr.price + tr.price;
                        if (total < bestTotal) {
                            bestTotal = total;
                            bestLeg = { fr, tr, middle: frPoint };
                        }
                    }
                }
            }

            if (bestLeg) {
                return res.json({
                    success: true,
                    fare: {
                        type: 'fixed',
                        price: bestTotal * seatMultiplier,
                        from,
                        to,
                        legs: [
                            { from, to: bestLeg.middle, price: bestLeg.fr.price },
                            { from: bestLeg.middle, to, price: bestLeg.tr.price },
                        ],
                        seats: seatMultiplier,
                        isLongDistance,
                        method: 'destination_price',
                    },
                });
            }
        }

        if (fixedPrice) {
            return res.json({
                success: true,
                fare: {
                    type: 'fixed',
                    price: fixedPrice.price * seatMultiplier,
                    from: fixedPrice.from,
                    to: fixedPrice.to,
                    distanceKm: fixedPrice.estimatedDistance || null,
                    durationMinutes: fixedPrice.estimatedDuration || null,
                    departureTimes: fixedPrice.departureTimes || [],
                    seats: seatMultiplier,
                    isLongDistance: fixedPrice.isLongDistance,
                    method: 'destination_price',
                },
            });
        }

        const vehicleQuery = { availability: 'online', status: { $ne: 'maintenance' } };
        if (isLongDistance) {
            vehicleQuery.isLongDistance = true;
            vehicleQuery.availableSeats = { $gt: 0 };
        } else {
            vehicleQuery.isLongDistance = false;
            vehicleQuery.status = 'idle';
        }
        if (vehicleType) vehicleQuery.type = vehicleType;
        Object.assign(vehicleQuery, partnerFilter);

        const vehicle = await Vehicle.findOne(vehicleQuery).sort({ pricePerKm: 1 });
        if (!vehicle) return res.json({ success: false, message: 'No available vehicles found' });

        const distanceResult = await calculateDistance({
            from, to, pickupCoords, dropoffCoords, manualDistance,
            pricePerKm: vehicle.pricePerKm || 0, baseFare: vehicle.baseFare || 0,
        });

        if (distanceResult.method === 'failed') return res.json({ success: false, message: distanceResult.error });

        res.json({
            success: true,
            fare: {
                type: 'dynamic',
                distanceKm: distanceResult.distanceKm,
                durationMinutes: distanceResult.durationMinutes || null,
                pricePerKm: vehicle.pricePerKm || 0,
                baseFare: vehicle.baseFare || 0,
                estimatedTotal: distanceResult.estimatedTotal * seatMultiplier,
                seats: seatMultiplier,
                isLongDistance,
                method: distanceResult.method,
                vehicleId: vehicle._id,
            },
        });
    } catch (error) { next(error); }
};

module.exports = { searchVehicles, getVehicle, calculatePublicFare };
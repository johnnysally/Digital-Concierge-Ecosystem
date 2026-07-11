const Vehicle = require('../../models/transport/Vehicle');

const searchVehicles = async (req, res, next) => {
    try {
        const { type } = req.query;
        const query = { status: 'available' };
        if (type) query.type = type;
        const vehicles = await Vehicle.find(query).populate('partner', 'businessName').sort({ pricePerKm: 1 }).limit(20);
        res.json({ success: true, vehicles });
    } catch (error) { next(error); }
};

const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, status: 'available' }).populate('partner', 'businessName');
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) { next(error); }
};

module.exports = { searchVehicles, getVehicle };
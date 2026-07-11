const Property = require('../../models/accommodation/Property');
const Room = require('../../models/accommodation/Room');

const searchProperties = async (req, res, next) => {
    try {
        const { city, type, minPrice, maxPrice, guests } = req.query;
        const query = { published: true };
        if (city) query['address.city'] = { $regex: city, $options: 'i' };
        if (type) query.type = type;
        const properties = await Property.find(query).sort({ rating: -1 }).limit(20);
        res.json({ success: true, properties });
    } catch (error) { next(error); }
};

const getProperty = async (req, res, next) => {
    try {
        const property = await Property.findOne({ _id: req.params.id, published: true });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
        const rooms = await Room.find({ property: req.params.id, status: 'available' });
        res.json({ success: true, property, rooms });
    } catch (error) { next(error); }
};

module.exports = { searchProperties, getProperty };
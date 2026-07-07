const Room = require('../../models/partner/Room');
const Property = require('../../models/partner/Property');

const createRoom = async (req, res, next) => {
    try {
        const property = await Property.findOne({ _id: req.body.property, partner: req.user._id });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        const room = await Room.create(req.body);
        res.status(201).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

const getRooms = async (req, res, next) => {
    try {
        const { propertyId, status } = req.query;
        const query = {};
        if (propertyId) query.property = propertyId;
        if (status) query.status = status;

        const partnerProperties = await Property.find({ partner: req.user._id }).select('_id');
        query.property = { $in: partnerProperties.map((p) => p._id) };

        const rooms = await Room.find(query).populate('property', 'name').sort({ createdAt: -1 });
        res.json({ success: true, rooms });
    } catch (error) {
        next(error);
    }
};

const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id).populate('property');
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

const updateRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, message: 'Room deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createRoom, getRooms, getRoom, updateRoom, deleteRoom };
const Room = require('../../models/accommodation/Room');
const Property = require('../../models/accommodation/Property');
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const logger = require('../../utils/logger');

const createRoom = async (req, res, next) => {
    try {
        const property = await Property.findOne({ _id: req.body.property, partner: req.user._id });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
        const room = await Room.create(req.body);
        res.status(201).json({ success: true, room });
    } catch (error) { next(error); }
};

const getRooms = async (req, res, next) => {
    try {
        const { propertyId, status } = req.query;
        const query = {};
        const partnerProperties = await Property.find({ partner: req.user._id }).select('_id');
        query.property = { $in: partnerProperties.map((p) => p._id) };
        if (propertyId) query.property = propertyId;
        if (status) query.status = status;
        const rooms = await Room.find(query).populate('property', 'name').sort({ createdAt: -1 });
        res.json({ success: true, rooms });
    } catch (error) { next(error); }
};

const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id).populate('property');
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, room });
    } catch (error) { next(error); }
};

const updateRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, room });
    } catch (error) { next(error); }
};

const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, message: 'Room deleted' });
    } catch (error) { next(error); }
};

const uploadRoomImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No images uploaded' });
        }

        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(file.path, {
                    folder: 'digital-safaris/rooms',
                }, (error, result) => {
                    fs.unlink(file.path, () => {});
                    if (error) reject(error);
                    else resolve(result.secure_url);
                });
            });
        });

        const imageUrls = await Promise.all(uploadPromises);
        res.json({ success: true, images: imageUrls });
    } catch (error) {
        logger.error(`Room image upload failed: ${error.message}`);
        next(error);
    }
};

module.exports = { createRoom, getRooms, getRoom, updateRoom, deleteRoom, uploadRoomImages };
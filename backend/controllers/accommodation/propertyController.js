const Property = require('../../models/accommodation/Property');
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const { partner: partnerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const createProperty = async (req, res, next) => {
    try { const property = await Property.create({ ...req.body, partner: req.user._id }); res.status(201).json({ success: true, property }); }
    catch (error) { next(error); }
};

const getMyProperties = async (req, res, next) => {
    try { const properties = await Property.find({ partner: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, properties }); }
    catch (error) { next(error); }
};

const getProperty = async (req, res, next) => {
    try {
        const property = await Property.findOne({ _id: req.params.id, partner: req.user._id });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
        res.json({ success: true, property });
    } catch (error) { next(error); }
};

const updateProperty = async (req, res, next) => {
    try {
        const property = await Property.findOneAndUpdate({ _id: req.params.id, partner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
        if (req.body.published === true) {
            partnerEmails.sendPropertyPublished(req.user, { id: property._id, name: property.name }).catch(e => logger.error(`Property published email failed: ${e.message}`));
        }
        res.json({ success: true, property });
    } catch (error) { next(error); }
};

const deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
        res.json({ success: true, message: 'Property deleted' });
    } catch (error) { next(error); }
};

const uploadPropertyImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No images uploaded' });
        }

        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(file.path, {
                    folder: 'digital-safaris/properties',
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
        logger.error(`Image upload failed: ${error.message}`);
        next(error);
    }
};

module.exports = { createProperty, getMyProperties, getProperty, updateProperty, deleteProperty, uploadPropertyImages };
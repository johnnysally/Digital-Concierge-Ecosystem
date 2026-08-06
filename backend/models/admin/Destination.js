const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    town: { type: mongoose.Schema.Types.ObjectId, ref: 'Town', required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['stage', 'landmark', 'estate', 'mall', 'office', 'other'], default: 'stage' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

destinationSchema.index({ town: 1, name: 1 }, { unique: true });
destinationSchema.index({ town: 1, isActive: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
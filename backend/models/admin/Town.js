const mongoose = require('mongoose');

const townSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    region: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

townSchema.index({ name: 1 });
townSchema.index({ isActive: 1 });

module.exports = mongoose.model('Town', townSchema);
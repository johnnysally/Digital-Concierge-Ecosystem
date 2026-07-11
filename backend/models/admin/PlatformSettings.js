const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    category: { type: String, enum: ['general', 'contact', 'localization', 'email', 'payment', 'security', 'ai', 'notifications', 'integrations', 'legal'], required: true },
    description: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

platformSettingsSchema.index({ category: 1 });

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
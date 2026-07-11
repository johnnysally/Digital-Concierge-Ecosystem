const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'AccommodationPartner', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['license', 'insurance', 'contract', 'tax', 'invoice', 'other'], required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    expiryDate: { type: Date },
    status: { type: String, enum: ['active', 'expired', 'archived'], default: 'active' },
}, { timestamps: true });

documentSchema.index({ partner: 1, status: 1 });

module.exports = mongoose.model('Document', documentSchema);
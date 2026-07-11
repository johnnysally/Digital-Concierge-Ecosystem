const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
    raisedBy: { type: String, enum: ['customer', 'partner'], required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    partner: { type: mongoose.Schema.Types.ObjectId, refPath: 'partnerModel' },
    partnerModel: { type: String, enum: ['AccommodationPartner', 'RestaurantPartner', 'TransportPartner'] },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'investigating', 'resolved', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    resolution: { type: String },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    resolvedAt: { type: Date },
}, { timestamps: true });

disputeSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('Dispute', disputeSchema);
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    photos: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    partnerReply: { type: String },
    repliedAt: { type: Date },
}, { timestamps: true });

reviewSchema.index({ property: 1, rating: -1 });
reviewSchema.index({ customer: 1 });

module.exports = mongoose.model('Review', reviewSchema);
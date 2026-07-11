const mongoose = require('mongoose');

const housekeepingSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'AccommodationPartner', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    taskType: { type: String, enum: ['cleaning', 'maintenance', 'inspection', 'turnover'], required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    notes: { type: String },
    completedAt: { type: Date },
}, { timestamps: true });

housekeepingSchema.index({ partner: 1, status: 1 });
housekeepingSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Housekeeping', housekeepingSchema);
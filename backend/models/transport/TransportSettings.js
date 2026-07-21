const mongoose = require('mongoose');

const transportSettingsSchema = new mongoose.Schema({
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportPartner', required: true, unique: true },
    businessName: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    address: { type: String },
    timezone: { type: String, default: 'Africa/Nairobi' },
    currency: { type: String, default: 'KES' },
    language: { type: String, default: 'en' },
    supportEmail: { type: String },
    supportPhone: { type: String },
    
    themeMode: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    themePreset: { type: String, enum: ['ocean', 'forest', 'sunset', 'midnight', 'custom'], default: 'ocean' },
    accentColor: { type: String, default: '#0ea5e9' },
    secondaryColor: { type: String, default: '#06b6d4' },
    
    portalName: { type: String },
    portalTagline: { type: String },
    defaultView: { type: String, enum: ['dashboard', 'map', 'rides', 'vehicles'], default: 'dashboard' },
    
    operations: {
        autoDispatch: { type: Boolean, default: false },
        maxDispatchRadius: { type: Number, default: 10 },
        allowScheduledRides: { type: Boolean, default: true },
        allowImmediateRides: { type: Boolean, default: true },
        requireDriverConfirmation: { type: Boolean, default: true },
        autoAssignNearestDriver: { type: Boolean, default: false },
    },
    
    notifications: {
        enableEmailNotifications: { type: Boolean, default: true },
        enableSmsNotifications: { type: Boolean, default: false },
        enablePushNotifications: { type: Boolean, default: true },
        newRideAlert: { type: Boolean, default: true },
        rideCompletedAlert: { type: Boolean, default: true },
        driverAvailableAlert: { type: Boolean, default: false },
        maintenanceReminder: { type: Boolean, default: true },
    },
    
    integrations: {
        googleMapsApiKey: { type: String },
        paymentProvider: { type: String, enum: ['stripe', 'mpesa', 'cash'], default: 'mpesa' },
        smsProvider: { type: String, default: 'twilio' },
        calendarSync: { type: Boolean, default: false },
        cloudStorage: { type: Boolean, default: false },
    },
    
    legal: {
        termsUrl: { type: String },
        privacyUrl: { type: String },
        cancellationPolicy: { type: String },
    },
    
    maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('TransportSettings', transportSettingsSchema);
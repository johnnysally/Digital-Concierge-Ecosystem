const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');

const defaultSettings = {
    businessName: 'Digital Safaris Partner',
    contactEmail: '',
    contactPhone: '',
    address: '',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    language: 'en',
    portalName: 'Digital Safaris Accommodation',
    portalTagline: 'Manage stays, reservations, and guest operations',
    accentColor: '#10b981',
    secondaryColor: '#0f766e',
    defaultView: 'dashboard',
    allowInstantBooking: true,
    requireApproval: false,
    autoConfirmReservations: true,
    sendArrivalReminders: true,
    sendCheckoutReminders: true,
    sendHousekeepingAlerts: true,
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    enableGuestMessaging: true,
    enableReviewRequests: true,
    paymentProvider: 'stripe',
    calendarSync: true,
    cloudStorage: true,
    supportEmail: '',
    supportPhone: '',
    termsUrl: '/terms',
    privacyUrl: '/privacy',
    maintenanceMode: false,
    themeMode: 'dark',
    themePreset: 'professional',
};

const mergeSettings = (baseSettings, overrides = {}) => ({
    ...baseSettings,
    ...overrides,
});

const getAccommodationSettings = async (req, res, next) => {
    try {
        const partner = await AccommodationPartner.findById(req.user._id);
        const savedSettings = partner?.preferences?.portalSettings || {};
        const settings = mergeSettings(defaultSettings, savedSettings);
        res.json({ success: true, settings });
    } catch (error) {
        next(error);
    }
};

const updateAccommodationSettings = async (req, res, next) => {
    try {
        const partner = await AccommodationPartner.findById(req.user._id);
        const nextSettings = mergeSettings(partner?.preferences?.portalSettings || {}, req.body);
        partner.preferences = partner.preferences || {};
        partner.preferences.portalSettings = nextSettings;
        await partner.save();
        res.json({ success: true, settings: nextSettings });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    defaultSettings,
    mergeSettings,
    getAccommodationSettings,
    updateAccommodationSettings,
};

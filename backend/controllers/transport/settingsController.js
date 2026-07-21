const TransportSettings = require('../../models/transport/TransportSettings');
const TransportPartner = require('../../models/transport/TransportPartner');

const getSettings = async (req, res, next) => {
    try {
        let settings = await TransportSettings.findOne({ partner: req.user._id });
        if (!settings) {
            settings = await TransportSettings.create({ partner: req.user._id, businessName: req.user.businessName, contactEmail: req.user.email });
        }
        const partner = await TransportPartner.findById(req.user._id).select('firstName lastName email businessName phone');
        res.json({
            success: true,
            settings: { ...settings.toObject(), ...partner.toObject() },
        });
    } catch (error) { next(error); }
};

const updateSettings = async (req, res, next) => {
    try {
        const allowed = ['businessName', 'contactEmail', 'contactPhone', 'address', 'timezone', 'currency', 'language',
            'supportEmail', 'supportPhone', 'themeMode', 'themePreset', 'accentColor', 'secondaryColor',
            'portalName', 'portalTagline', 'defaultView', 'operations', 'notifications', 'integrations', 'legal', 'maintenanceMode'];

        const updates = {};
        Object.keys(req.body).forEach(key => { if (allowed.includes(key)) updates[key] = req.body[key]; });

        const settings = await TransportSettings.findOneAndUpdate(
            { partner: req.user._id },
            updates,
            { new: true, upsert: true, runValidators: true }
        );

        if (req.body.businessName) {
            await TransportPartner.findByIdAndUpdate(req.user._id, { businessName: req.body.businessName });
        }

        res.json({ success: true, settings });
    } catch (error) { next(error); }
};

module.exports = { getSettings, updateSettings };
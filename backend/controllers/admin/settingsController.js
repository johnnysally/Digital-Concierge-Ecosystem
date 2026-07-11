const PlatformSettings = require('../../models/admin/PlatformSettings');
const Commission = require('../../models/admin/Commission');

const getAllSettings = async (req, res, next) => {
    try {
        const settings = await PlatformSettings.find().sort({ category: 1, key: 1 });
        const grouped = {};
        settings.forEach(s => {
            if (!grouped[s.category]) grouped[s.category] = [];
            grouped[s.category].push(s);
        });
        res.json({ success: true, settings: grouped });
    } catch (error) { next(error); }
};

const getSettingsByCategory = async (req, res, next) => {
    try {
        const settings = await PlatformSettings.find({ category: req.params.category }).sort({ key: 1 });
        res.json({ success: true, settings });
    } catch (error) { next(error); }
};

const updateSetting = async (req, res, next) => {
    try {
        const { value } = req.body;
        const setting = await PlatformSettings.findOneAndUpdate(
            { key: req.params.key },
            { value, updatedBy: req.user._id },
            { new: true, upsert: true }
        );
        res.json({ success: true, setting });
    } catch (error) { next(error); }
};

const bulkUpdateSettings = async (req, res, next) => {
    try {
        const { settings } = req.body;
        const updates = settings.map(s =>
            PlatformSettings.findOneAndUpdate({ key: s.key }, { value: s.value, updatedBy: req.user._id }, { new: true, upsert: true })
        );
        await Promise.all(updates);
        res.json({ success: true, message: 'Settings updated' });
    } catch (error) { next(error); }
};

const getCommissions = async (req, res, next) => {
    try {
        const commissions = await Commission.find();
        res.json({ success: true, commissions });
    } catch (error) { next(error); }
};

const updateCommission = async (req, res, next) => {
    try {
        const commission = await Commission.findOneAndUpdate(
            { partnerType: req.params.type },
            req.body,
            { new: true, upsert: true, runValidators: true }
        );
        res.json({ success: true, commission });
    } catch (error) { next(error); }
};

const getPublicSettings = async (req, res, next) => {
    try {
        const publicKeys = ['site_name', 'site_tagline', 'site_description', 'site_logo', 'primary_color', 'secondary_color',
            'support_email', 'support_phone', 'support_hours', 'default_currency', 'default_language'];
        const settings = await PlatformSettings.find({ key: { $in: publicKeys } });
        const result = {};
        settings.forEach(s => { result[s.key] = s.value; });
        res.json({ success: true, settings: result });
    } catch (error) { next(error); }
};

module.exports = { getAllSettings, getSettingsByCategory, updateSetting, bulkUpdateSettings, getCommissions, updateCommission, getPublicSettings };
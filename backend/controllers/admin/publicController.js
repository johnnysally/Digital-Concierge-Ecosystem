const PlatformSettings = require('../../models/admin/PlatformSettings');

const getPublicConfig = async (req, res, next) => {
    try {
        const keys = [
            'site_name', 'site_tagline', 'site_description', 'site_logo', 'site_favicon',
            'primary_color', 'secondary_color',
            'support_email', 'support_phone', 'support_hours',
            'default_currency', 'default_language', 'date_format',
            'maintenance_mode',
            'ai_enabled',
            'company_name', 'company_address',
        ];
        const settings = await PlatformSettings.find({ key: { $in: keys } });
        const config = {};
        settings.forEach(s => { config[s.key] = s.value; });
        res.json({ success: true, config });
    } catch (error) { next(error); }
};

const getTerms = async (req, res, next) => {
    try {
        const content = await PlatformSettings.findOne({ key: 'terms_content' });
        const updated = await PlatformSettings.findOne({ key: 'terms_updated' });
        res.json({ success: true, type: 'terms', content: content?.value || '', lastUpdated: updated?.value || null });
    } catch (error) { next(error); }
};

const getPrivacy = async (req, res, next) => {
    try {
        const content = await PlatformSettings.findOne({ key: 'privacy_content' });
        const updated = await PlatformSettings.findOne({ key: 'privacy_updated' });
        res.json({ success: true, type: 'privacy', content: content?.value || '', lastUpdated: updated?.value || null });
    } catch (error) { next(error); }
};

const getCookies = async (req, res, next) => {
    try {
        const content = await PlatformSettings.findOne({ key: 'cookies_content' });
        const updated = await PlatformSettings.findOne({ key: 'cookies_updated' });
        res.json({ success: true, type: 'cookies', content: content?.value || '', lastUpdated: updated?.value || null });
    } catch (error) { next(error); }
};

module.exports = { getPublicConfig, getTerms, getPrivacy, getCookies };
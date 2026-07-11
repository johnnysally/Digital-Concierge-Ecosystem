const PlatformSettings = require('../../models/admin/PlatformSettings');
const logger = require('../../utils/logger');

const getLegalPage = async (req, res, next) => {
    try {
        const { type } = req.params;
        const keyMap = {
            terms: { content: 'terms_content', updated: 'terms_updated' },
            privacy: { content: 'privacy_content', updated: 'privacy_updated' },
            cookies: { content: 'cookies_content', updated: 'cookies_updated' },
        };

        if (!keyMap[type]) return res.status(404).json({ success: false, message: 'Legal page not found' });

        const content = await PlatformSettings.findOne({ key: keyMap[type].content });
        const updated = await PlatformSettings.findOne({ key: keyMap[type].updated });

        res.json({
            success: true,
            type,
            content: content?.value || '',
            lastUpdated: updated?.value || null,
        });
    } catch (error) { next(error); }
};

const updateLegalPage = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { content } = req.body;
        const keyMap = {
            terms: { content: 'terms_content', updated: 'terms_updated' },
            privacy: { content: 'privacy_content', updated: 'privacy_updated' },
            cookies: { content: 'cookies_content', updated: 'cookies_updated' },
        };

        if (!keyMap[type]) return res.status(400).json({ success: false, message: 'Invalid legal type' });

        await PlatformSettings.findOneAndUpdate(
            { key: keyMap[type].content },
            { value: content, updatedBy: req.user._id, category: 'legal', description: `${type} page content` },
            { upsert: true }
        );

        await PlatformSettings.findOneAndUpdate(
            { key: keyMap[type].updated },
            { value: new Date().toISOString(), updatedBy: req.user._id, category: 'legal', description: `${type} last updated` },
            { upsert: true }
        );

        logger.info(`Legal page updated: ${type} by ${req.user.email}`);

        res.json({ success: true, message: `${type} updated successfully`, lastUpdated: new Date().toISOString() });
    } catch (error) { next(error); }
};

const getAllLegalPages = async (req, res, next) => {
    try {
        const keys = ['terms_content', 'terms_updated', 'privacy_content', 'privacy_updated', 'cookies_content', 'cookies_updated'];
        const settings = await PlatformSettings.find({ key: { $in: keys } });

        const legal = {
            terms: { content: '', lastUpdated: null },
            privacy: { content: '', lastUpdated: null },
            cookies: { content: '', lastUpdated: null },
        };

        settings.forEach(s => {
            if (s.key === 'terms_content') legal.terms.content = s.value;
            if (s.key === 'terms_updated') legal.terms.lastUpdated = s.value;
            if (s.key === 'privacy_content') legal.privacy.content = s.value;
            if (s.key === 'privacy_updated') legal.privacy.lastUpdated = s.value;
            if (s.key === 'cookies_content') legal.cookies.content = s.value;
            if (s.key === 'cookies_updated') legal.cookies.lastUpdated = s.value;
        });

        res.json({ success: true, legal });
    } catch (error) { next(error); }
};

const getPublicLegalPage = async (req, res, next) => {
    try {
        const { type } = req.params;
        const keyMap = {
            terms: 'terms_content',
            privacy: 'privacy_content',
            cookies: 'cookies_content',
        };

        if (!keyMap[type]) return res.status(404).json({ success: false, message: 'Page not found' });

        const content = await PlatformSettings.findOne({ key: keyMap[type] });
        const updated = await PlatformSettings.findOne({ key: `${type}_updated` });

        res.json({
            success: true,
            type,
            content: content?.value || '',
            lastUpdated: updated?.value || null,
        });
    } catch (error) { next(error); }
};

module.exports = { getLegalPage, updateLegalPage, getAllLegalPages, getPublicLegalPage };
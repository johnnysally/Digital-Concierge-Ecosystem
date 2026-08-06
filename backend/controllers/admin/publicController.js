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

const getSupportInfo = async (req, res, next) => {
    try {
        const keys = ['support_email', 'support_phone', 'support_hours', 'emergency_contact', 'admin_email'];
        const settings = await PlatformSettings.find({ key: { $in: keys } });
        const info = {};
        settings.forEach(s => { info[s.key] = s.value; });
        res.json({
            success: true,
            support: {
                email: info.support_email || 'support@digitalsafaris.com',
                phone: info.support_phone || '+254 700 000000',
                hours: info.support_hours || '24/7',
                emergency: info.emergency_contact || '+254 700 000999',
                admin: info.admin_email || 'admin@digitalsafaris.com',
            },
        });
    } catch (error) { next(error); }
};

const submitContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
        }
        const { customer: customerEmails } = require('../../services/emailService');
        const logger = require('../../utils/logger');

        const adminEmailSetting = await PlatformSettings.findOne({ key: 'admin_email' });
        const adminEmail = adminEmailSetting?.value || 'admin@digitalsafaris.com';

        await customerEmails.send({
            to: adminEmail,
            subject: `Contact Form: ${subject || 'New Message'} from ${name}`,
            htmlBody: `<h2>New Contact Message</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject || 'N/A'}</p><p><strong>Message:</strong></p><p>${message}</p>`,
            textBody: `From: ${name} (${email})\nSubject: ${subject || 'N/A'}\nMessage: ${message}`,
        }).catch(e => logger.error('Contact email failed: ' + e.message));

        res.json({ success: true, message: 'Message sent successfully.' });
    } catch (error) { next(error); }
};

module.exports = { getPublicConfig, getTerms, getPrivacy, getCookies, getSupportInfo, submitContact };
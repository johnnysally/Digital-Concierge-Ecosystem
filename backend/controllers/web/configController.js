const PlatformSettings = require('../../models/admin/PlatformSettings');
const logger = require('../../utils/logger');

const getSiteConfig = async (req, res, next) => {
    try {
        const settings = await PlatformSettings.find({
            category: { $in: ['app_links', 'social_links', 'website', 'contact', 'general'] }
        });

        const config = {};
        settings.forEach(s => {
            config[s.key] = s.value;
        });

        // Filter links by enabled condition
        const filterEnabledLink = (key) => {
            const val = config[key];
            if (val && typeof val === 'object' && 'enabled' in val) {
                return val.enabled ? val.url || val : null;
            }
            return val || null;
        };

        const filtered = {
            site_name: config.site_name || 'DigitalSafari',
            site_tagline: config.site_tagline || 'Your journey. One platform.',
            site_description: config.site_description || 'Connecting accommodation, food, transportation, and experiences through one digital platform.',
            support_email: filterEnabledLink('support_email'),
            support_phone: filterEnabledLink('support_phone'),
            whatsapp_number: filterEnabledLink('whatsapp_number'),

            app_links: {
                customer: filterEnabledLink('customer_app_url'),
                transport_partner: filterEnabledLink('transport_partner_url'),
                restaurant_partner: filterEnabledLink('restaurant_partner_url'),
                accommodation_partner: filterEnabledLink('accommodation_partner_url'),
            },

            social_links: {
                instagram: filterEnabledLink('social_instagram'),
                tiktok: filterEnabledLink('social_tiktok'),
                facebook: filterEnabledLink('social_facebook'),
                linkedin: filterEnabledLink('social_linkedin'),
                x: filterEnabledLink('social_x'),
                youtube: filterEnabledLink('social_youtube'),
            },

            ai_chat: {
                enabled: config.ai_chat_enabled === true,
                name: config.ai_chat_name || 'Safari Assistant',
                greeting: config.ai_chat_greeting || 'Hi! How can I help you today?',
                color: config.ai_chat_color || '#10b981',
            },
        };

        res.json({ success: true, config: filtered });
    } catch (error) {
        logger.error(`Web config failed: ${error.message}`);
        next(error);
    }
};

module.exports = { getSiteConfig };
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const PlatformSettings = require('../models/admin/PlatformSettings');

const defaultSettings = [
    { key: 'site_name', value: 'Digital Concierge', category: 'general', description: 'Platform name displayed across all apps' },
    { key: 'site_tagline', value: 'Your complete travel command center', category: 'general', description: 'Short description below site name' },
    { key: 'site_description', value: 'Unified platform for booking stays, ordering dining, arranging transport, and managing rewards.', category: 'general', description: 'Meta description for SEO' },
    { key: 'site_logo', value: '', category: 'general', description: 'URL to site logo' },
    { key: 'site_favicon', value: '', category: 'general', description: 'URL to favicon' },
    { key: 'primary_color', value: '#3b82f6', category: 'general', description: 'Primary brand color hex' },
    { key: 'secondary_color', value: '#22c55e', category: 'general', description: 'Secondary brand color hex' },

    { key: 'support_email', value: 'support@digitalconcierge.com', category: 'contact', description: 'Customer support email' },
    { key: 'support_phone', value: '+254 700 000000', category: 'contact', description: 'Customer support phone' },
    { key: 'support_hours', value: '24/7', category: 'contact', description: 'Support availability hours' },
    { key: 'emergency_contact', value: '+254 700 000999', category: 'contact', description: 'Emergency contact number' },
    { key: 'admin_email', value: 'admin@digitalconcierge.com', category: 'contact', description: 'Admin notifications email' },

    { key: 'default_currency', value: 'KES', category: 'localization', description: 'Default currency for all transactions' },
    { key: 'default_language', value: 'en', category: 'localization', description: 'Default language' },
    { key: 'timezone', value: 'Africa/Nairobi', category: 'localization', description: 'Default timezone' },
    { key: 'date_format', value: 'MM/DD/YYYY', category: 'localization', description: 'Date display format' },
    { key: 'available_currencies', value: ['KES', 'USD', 'EUR', 'GBP'], category: 'localization', description: 'Supported currencies' },
    { key: 'available_languages', value: ['en', 'sw', 'fr'], category: 'localization', description: 'Supported languages' },

    { key: 'email_provider', value: 'brevo', category: 'email', description: 'Email service provider (brevo/hdm)' },
    { key: 'email_from_name', value: 'Digital Concierge', category: 'email', description: 'Sender name for emails' },
    { key: 'email_from_address', value: 'noreply@digitalconcierge.com', category: 'email', description: 'Sender email address' },
    { key: 'email_footer_text', value: '© Digital Concierge. All rights reserved.', category: 'email', description: 'Email footer text' },
    { key: 'welcome_email_enabled', value: true, category: 'email', description: 'Send welcome email on registration' },
    { key: 'booking_confirmation_enabled', value: true, category: 'email', description: 'Send booking confirmation email' },

    { key: 'payment_methods', value: ['stripe', 'mpesa', 'wallet', 'airtel'], category: 'payment', description: 'Available payment methods' },
    { key: 'commission_accommodation', value: 10, category: 'payment', description: 'Commission percentage for accommodation' },
    { key: 'commission_restaurant', value: 15, category: 'payment', description: 'Commission percentage for restaurants' },
    { key: 'commission_transport', value: 12, category: 'payment', description: 'Commission percentage for transport' },
    { key: 'min_payout', value: 50, category: 'payment', description: 'Minimum payout amount' },
    { key: 'payout_schedule', value: 'weekly', category: 'payment', description: 'Payout frequency' },

    { key: 'max_login_attempts', value: 5, category: 'security', description: 'Max failed login attempts before lockout' },
    { key: 'session_timeout', value: 60, category: 'security', description: 'Session timeout in minutes' },
    { key: 'two_factor_required', value: false, category: 'security', description: 'Require 2FA for all users' },
    { key: 'password_min_length', value: 6, category: 'security', description: 'Minimum password length' },
    { key: 'maintenance_mode', value: false, category: 'security', description: 'Put platform in maintenance mode' },
    { key: 'backup_auto_enabled', value: true, category: 'security', description: 'Enable automatic backups' },
    { key: 'backup_frequency', value: 'daily', category: 'security', description: 'Backup frequency (daily/weekly/monthly)' },
    { key: 'backup_email_enabled', value: false, category: 'security', description: 'Email backup after creation' },
    { key: 'backup_email_address', value: 'admin@digitalconcierge.com', category: 'security', description: 'Email to send backups to' },
    { key: 'backup_retention_days', value: 30, category: 'security', description: 'Days to keep backups before deletion' },

    { key: 'ai_provider', value: 'keyword', category: 'ai', description: 'AI provider: keyword, openai, hdm' },
    { key: 'ai_model', value: 'gpt-4', category: 'ai', description: 'AI model (for OpenAI)' },
    { key: 'ai_max_tokens', value: 500, category: 'ai', description: 'Max tokens per response' },
    { key: 'ai_temperature', value: 0.7, category: 'ai', description: 'AI creativity level (0-1)' },
    { key: 'ai_welcome_message', value: "Hello! I'm your Digital Concierge. How can I help you today?", category: 'ai', description: 'Welcome message from AI' },
    { key: 'ai_suggestions_enabled', value: true, category: 'ai', description: 'Show AI suggestions after responses' },
    { key: 'openai_api_key', value: '', category: 'ai', description: 'OpenAI API key' },
    { key: 'hdm_ai_url', value: 'https://hdmaiserver.pxxl.click', category: 'ai', description: 'HDM AI base URL' },
    { key: 'hdm_ai_api_key', value: '', category: 'ai', description: 'HDM AI API key' },

    { key: 'push_enabled', value: true, category: 'notifications', description: 'Enable push notifications' },
    { key: 'sms_enabled', value: true, category: 'notifications', description: 'Enable SMS notifications' },
    { key: 'email_notifications_enabled', value: true, category: 'notifications', description: 'Enable email notifications' },
    { key: 'order_updates_enabled', value: true, category: 'notifications', description: 'Send order status updates' },
    { key: 'booking_reminders_enabled', value: true, category: 'notifications', description: 'Send booking reminders' },

    { key: 'google_maps_api_key', value: '', category: 'integrations', description: 'Google Maps API key' },
    { key: 'stripe_public_key', value: '', category: 'integrations', description: 'Stripe publishable key' },
    { key: 'cloudinary_enabled', value: true, category: 'integrations', description: 'Enable Cloudinary for images' },
    { key: 'sms_provider', value: 'twilio', category: 'integrations', description: 'SMS provider' },

    { key: 'terms_url', value: '/terms', category: 'legal', description: 'Terms of service URL' },
    { key: 'privacy_url', value: '/privacy', category: 'legal', description: 'Privacy policy URL' },
    { key: 'refund_policy_url', value: '/refunds', category: 'legal', description: 'Refund policy URL' },
    { key: 'company_name', value: 'Digital Concierge Ltd', category: 'legal', description: 'Legal company name' },
    { key: 'company_address', value: 'Nairobi, Kenya', category: 'legal', description: 'Company address' },
    { key: 'terms_content', value: '<h2>Terms and Conditions</h2><p>Welcome to Digital Concierge. By using our platform, you agree to these terms.</p>', category: 'legal', description: 'Terms and conditions page content' },
    { key: 'terms_updated', value: new Date().toISOString(), category: 'legal', description: 'Terms last updated date' },
    { key: 'privacy_content', value: '<h2>Privacy Policy</h2><p>We value your privacy. This policy explains how we collect and use your data.</p>', category: 'legal', description: 'Privacy policy page content' },
    { key: 'privacy_updated', value: new Date().toISOString(), category: 'legal', description: 'Privacy policy last updated date' },
    { key: 'cookies_content', value: '<h2>Cookie Policy</h2><p>We use cookies to enhance your experience. Learn about our cookie practices.</p>', category: 'legal', description: 'Cookie policy page content' },
    { key: 'cookies_updated', value: new Date().toISOString(), category: 'legal', description: 'Cookie policy last updated date' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Seeding platform settings...');
    for (const setting of defaultSettings) {
        await PlatformSettings.findOneAndUpdate({ key: setting.key }, setting, { upsert: true });
    }
    console.log(`${defaultSettings.length} settings seeded successfully.`);
    process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
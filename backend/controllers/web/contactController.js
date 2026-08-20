const PlatformSettings = require('../../models/admin/PlatformSettings');
const { customer: customerEmails } = require('../../services/emailService');
const logger = require('../../utils/logger');

const submitContact = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
        }

        const adminEmailSetting = await PlatformSettings.findOne({ key: 'admin_email' });
        const adminEmail = adminEmailSetting?.value || 'admin@digitalsafaris.com';

        await customerEmails.send({
            to: adminEmail,
            subject: `[Website] ${subject || 'New Contact Message'} from ${name}`,
            htmlBody: `
                <h2>New Website Contact Message</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
            textBody: `From: ${name} (${email})\n${phone ? 'Phone: ' + phone + '\n' : ''}Subject: ${subject || 'N/A'}\nMessage: ${message}`,
        }).catch(e => logger.error('Contact email failed: ' + e.message));

        res.json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        logger.error(`Contact form failed: ${error.message}`);
        next(error);
    }
};

module.exports = { submitContact };
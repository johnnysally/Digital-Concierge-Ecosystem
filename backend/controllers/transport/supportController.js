const SupportTicket = require('../../models/customer/SupportTicket');
const TransportSettings = require('../../models/transport/TransportSettings');
const PlatformSettings = require('../../models/admin/PlatformSettings');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const getSupportInfo = async (req, res, next) => {
    try {
        const settings = await TransportSettings.findOne({ partner: req.user._id });

        const [supportEmail, supportPhone, supportHours, emergencyContact, adminEmail] = await Promise.all([
            PlatformSettings.findOne({ key: 'support_email' }),
            PlatformSettings.findOne({ key: 'support_phone' }),
            PlatformSettings.findOne({ key: 'support_hours' }),
            PlatformSettings.findOne({ key: 'emergency_contact' }),
            PlatformSettings.findOne({ key: 'admin_email' }),
        ]);

        res.json({
            success: true,
            support: {
                partner: {
                    email: settings?.supportEmail || req.user.email,
                    phone: settings?.supportPhone || req.user.phone || 'Not set',
                },
                platform: {
                    email: supportEmail?.value || 'support@digitalsafaris.com',
                    phone: supportPhone?.value || '+254 700 000000',
                    hours: supportHours?.value || '24/7',
                    emergency: emergencyContact?.value || '+254 700 000999',
                    admin: adminEmail?.value || 'admin@digitalsafaris.com',
                },
            },
        });
    } catch (error) { next(error); }
};

const createTicket = async (req, res, next) => {
    try {
        const { subject, description, priority } = req.body;
        const ticket = await SupportTicket.create({
            customer: req.user._id,
            subject: `[Transport] ${subject}`,
            description,
            priority: priority || 'medium',
        });
        createNotification({
            customerId: req.user._id,
            type: 'system',
            title: 'Support Ticket Submitted',
            message: `Your ticket "${subject}" has been received. We'll respond shortly.`,
        }).catch(e => logger.error(`Notification failed: ${e.message}`));
        res.status(201).json({ success: true, ticket });
    } catch (error) { next(error); }
};

const getMyTickets = async (req, res, next) => {
    try {
        const tickets = await SupportTicket.find({ customer: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, tickets });
    } catch (error) { next(error); }
};

const getTicket = async (req, res, next) => {
    try {
        const ticket = await SupportTicket.findOne({ _id: req.params.id, customer: req.user._id });
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json({ success: true, ticket });
    } catch (error) { next(error); }
};

module.exports = { getSupportInfo, createTicket, getMyTickets, getTicket };
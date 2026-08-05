const Dispute = require('../../models/admin/Dispute');
const { send } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const getAll = async (req, res, next) => {
    try {
        const { status, priority, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;
        const disputes = await Dispute.find(query)
            .populate('customer', 'firstName lastName email')
            .populate('partner', 'firstName lastName businessName')
            .select('+metadata')
            .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Dispute.countDocuments(query);
        res.json({ success: true, disputes, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getOne = async (req, res, next) => {
    try {
        const dispute = await Dispute.findById(req.params.id)
            .populate('customer', 'firstName lastName email phone')
            .populate('partner', 'firstName lastName businessName email phone')
            .select('+metadata');
        if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
        res.json({ success: true, dispute });
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const { status, priority, resolution, sendEmail } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (resolution) updateData.resolution = resolution;
        if (status === 'resolved' || status === 'closed') {
            updateData.resolvedBy = req.user._id;
            updateData.resolvedAt = new Date();
        }

        const dispute = await Dispute.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('customer', 'firstName lastName email')
            .select('+metadata');

        if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });

        if (sendEmail && dispute.customer?.email) {
            const name = dispute.customer.firstName || 'Customer';
            send({
                to: dispute.customer.email,
                subject: `Dispute Update — #${dispute._id.toString().slice(-6)}`,
                htmlBody: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif"><h2>Dispute Update</h2><p>Hi ${name},</p><p>Your dispute <strong>"${dispute.subject}"</strong> has been updated.</p><p><strong>Status:</strong> ${dispute.status}</p>${resolution ? `<p><strong>Resolution:</strong> ${resolution}</p>` : ''}<hr><p style="color:#666;font-size:12px">Digital Safaris</p></div>`,
                textBody: `Dispute Update: ${dispute.subject}\nStatus: ${dispute.status}${resolution ? '\nResolution: ' + resolution : ''}`,
            }).catch(e => logger.error('Email failed: ' + e.message));

            createNotification({
                customerId: dispute.customer._id?.toString(),
                type: 'system', title: 'Dispute Updated',
                message: `Your dispute "${dispute.subject}" status: ${dispute.status}.`,
            }).catch(() => {});
        }

        res.json({ success: true, dispute });
    } catch (error) { next(error); }
};

const reply = async (req, res, next) => {
    try {
        const { message, sendEmail } = req.body;
        const dispute = await Dispute.findById(req.params.id)
            .populate('customer', 'firstName lastName email')
            .select('+metadata');
        if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });

        const replies = dispute.metadata?.replies || [];
        replies.push({ from: 'admin', message, by: req.user.firstName + ' ' + req.user.lastName, date: new Date() });
        dispute.metadata = { ...(dispute.metadata || {}), replies };
        if (dispute.status === 'open') dispute.status = 'investigating';
        await dispute.save();

        if (sendEmail && dispute.customer?.email) {
            const name = dispute.customer.firstName || 'Customer';
            send({
                to: dispute.customer.email,
                subject: `Reply — #${dispute._id.toString().slice(-6)}`,
                htmlBody: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif"><h2>Response</h2><p>Hi ${name},</p><div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0"><p style="margin:0">${message}</p></div><hr><p style="color:#666;font-size:12px">Digital Safaris</p></div>`,
                textBody: `Reply to dispute "${dispute.subject}":\n\n${message}`,
            }).catch(e => logger.error('Email failed: ' + e.message));
        }

        res.json({ success: true, dispute });
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    try {
        const dispute = await Dispute.findByIdAndDelete(req.params.id);
        if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
        res.json({ success: true, message: 'Dispute deleted' });
    } catch (error) { next(error); }
};

module.exports = { getAll, getOne, update, reply, remove };
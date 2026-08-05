const Dispute = require('../../models/admin/Dispute');
const Booking = require('../../models/customer/Booking');
const Order = require('../../models/restaurant/Order');
const Ride = require('../../models/transport/Ride');
const Admin = require('../../models/admin/Admin');
const { send } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const create = async (req, res, next) => {
    try {
        const { subject, description, bookingId, orderId, rideId, partnerId, partnerModel } = req.body;

        let contextData = {};
        let partnerName = 'N/A';

        if (bookingId) {
            const booking = await Booking.findById(bookingId).populate('property', 'name').populate('room', 'roomNumber type').lean();
            if (booking) {
                contextData = { type: 'booking', booking: { _id: booking._id, propertyName: booking.property?.name, roomNumber: booking.room?.roomNumber, roomType: booking.room?.type, checkIn: booking.checkIn, checkOut: booking.checkOut, guests: booking.guests, totalAmount: booking.totalAmount, status: booking.status, paymentStatus: booking.paymentStatus } };
            }
        }

        if (orderId) {
            const order = await Order.findById(orderId).populate('partner', 'businessName email phone').lean();
            if (order) {
                contextData = { type: 'order', order: { _id: order._id, restaurantName: order.partner?.businessName, restaurantEmail: order.partner?.email, restaurantPhone: order.partner?.phone, items: order.items, total: order.total, orderType: order.orderType, deliveryAddress: order.deliveryAddress, status: order.status, paymentStatus: order.paymentStatus, notes: order.notes, createdAt: order.createdAt } };
                partnerName = order.partner?.businessName || 'N/A';
            }
        }

        if (rideId) {
            const ride = await Ride.findById(rideId).populate('vehicle', 'make model plateNumber type').populate('partner', 'businessName email phone').lean();
            if (ride) {
                contextData = { type: 'ride', ride: { _id: ride._id, vehicleName: `${ride.vehicle?.make} ${ride.vehicle?.model}`, plateNumber: ride.vehicle?.plateNumber, vehicleType: ride.vehicle?.type, partnerName: ride.partner?.businessName, partnerEmail: ride.partner?.email, partnerPhone: ride.partner?.phone, pickup: ride.pickup, dropoff: ride.dropoff, fare: ride.fare, distance: ride.distance, status: ride.status, paymentStatus: ride.paymentStatus, rideType: ride.rideType, createdAt: ride.createdAt } };
                partnerName = ride.partner?.businessName || 'N/A';
            }
        }

      const dispute = await Dispute.create({
    raisedBy: 'customer', customer: req.user._id, partner: partnerId,
    partnerModel: partnerModel || 'AccommodationPartner', 
    booking: bookingId || orderId || rideId || null,
    subject: subject || 'Issue reported', description: description || '',
    metadata: { customerName: `${req.user.firstName} ${req.user.lastName}`, customerEmail: req.user.email, customerPhone: req.user.phone, partnerName, ...contextData },
});

        const customerName = `${req.user.firstName} ${req.user.lastName}`;

        const admins = await Admin.find({ isActive: true, 'permissions.disputes': true });
        for (const admin of admins) {
            send({
                to: admin.email,
                subject: `New Dispute — ${subject}`,
                htmlBody: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif;background:#fff;padding:24px;border-radius:12px"><h2 style="color:#ef4444">🚩 New Dispute</h2><table style="width:100%"><tr><td style="color:#666">Customer</td><td style="font-weight:bold">${customerName} (${req.user.email})</td></tr><tr><td style="color:#666">Subject</td><td style="font-weight:bold">${subject}</td></tr><tr><td style="color:#666">Partner</td><td>${partnerName}</td></tr></table><p style="margin-top:16px">${description || ''}</p><a href="${process.env.ADMIN_URL || 'http://localhost:3001'}/disputes" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">View in Admin</a></div>`,
                textBody: `New dispute from ${customerName}: ${subject}\nPartner: ${partnerName}`,
            }).catch(e => logger.error('Admin email failed: ' + e.message));

            createNotification({ partnerId: admin._id.toString(), type: 'system', title: 'New Dispute', message: `${customerName} reported: ${subject}` }).catch(() => {});
        }

        createNotification({ customerId: req.user._id.toString(), type: 'system', title: 'Dispute Submitted', message: `Your dispute "${subject}" has been submitted.` }).catch(() => {});

        res.status(201).json({ success: true, dispute, message: 'Issue reported. Admin will review.' });
    } catch (error) { next(error); }
};

const getMy = async (req, res, next) => {
    try {
        const disputes = await Dispute.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, disputes });
    } catch (error) { next(error); }
};

module.exports = { create, getMy };
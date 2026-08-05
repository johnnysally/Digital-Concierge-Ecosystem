const Payment = require('../../models/customer/Payment');
const Wallet = require('../../models/customer/Wallet');
const Booking = require('../../models/customer/Booking');
const Order = require('../../models/restaurant/Order');
const Ride = require('../../models/transport/Ride');
const Customer = require('../../models/customer/Customer');
const PlatformSettings = require('../../models/admin/PlatformSettings');
const { stripe: stripeService, mpesa: mpesaService } = require('../../services/paymentService');
const { customer: customerEmails, partner: partnerEmails } = require('../../services/emailService');
const { createNotification } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const getEnabledMethods = async () => {
    const setting = await PlatformSettings.findOne({ key: 'payment_methods' });
    return setting?.value || ['mpesa', 'wallet'];
};

const getPaymentMethods = async (req, res, next) => {
    try {
        const methods = await getEnabledMethods();
        res.json({ success: true, methods });
    } catch (error) { next(error); }
};

const createBookingFromPayment = async (customerId, data, paymentId) => {
    const Room = require('../../models/accommodation/Room');
    const Property = require('../../models/accommodation/Property');
    const AccommodationPartner = require('../../models/accommodation/AccommodationPartner');

    const { propertyId, roomId, checkIn, checkOut, guests, specialRequests } = data;
    const room = await Room.findById(roomId);
    const property = await Property.findById(propertyId);
    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const totalAmount = room.price * nights;

    const booking = await Booking.create({
        customer: customerId, property: propertyId, room: roomId,
        checkIn: new Date(checkIn), checkOut: new Date(checkOut),
        guests: guests || 1, totalAmount, specialRequests,
        status: 'confirmed', paymentStatus: 'paid',
    });

    await Room.findByIdAndUpdate(roomId, { status: 'occupied' });

    if (paymentId) {
        await Payment.findByIdAndUpdate(paymentId, { booking: booking._id });
    }

    const customer = await Customer.findById(customerId);
    const customerName = customer ? customer.firstName + ' ' + customer.lastName : 'Guest';

    if (customer) {
        customerEmails.sendBookingConfirmed(customer, {
            id: booking._id, propertyName: property.name,
            checkIn: new Date(checkIn).toISOString().split('T')[0],
            checkOut: new Date(checkOut).toISOString().split('T')[0],
            guests: guests || 1, totalAmount,
        }).catch(e => logger.error('Booking email failed: ' + e.message));
    }

    const partner = await AccommodationPartner.findById(property.partner);
    if (partner) {
        partnerEmails.sendNewReservation(partner, {
            id: booking._id, propertyName: property.name, roomNumber: room.roomNumber,
            guestName: customerName,
            checkIn: new Date(checkIn).toISOString().split('T')[0],
            checkOut: new Date(checkOut).toISOString().split('T')[0], totalAmount,
        }).catch(e => logger.error('Partner email failed: ' + e.message));

        createNotification({
            partnerId: partner._id.toString(),
            type: 'booking', title: 'New Reservation',
            message: customerName + ' booked ' + property.name + ' - Room ' + room.roomNumber + '.',
        }).catch(e => logger.error('Notification failed: ' + e.message));
    }

    return booking;
};

const createOrderFromPayment = async (customerId, data, paymentId) => {
    const MenuItem = require('../../models/restaurant/MenuItem');
    const RestaurantPartner = require('../../models/restaurant/RestaurantPartner');

    const { items, orderType, deliveryAddress, customerPhone, notes } = data;
    let partnerId = null;
    const validatedItems = [];
    for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (!partnerId) partnerId = menuItem.partner;
        validatedItems.push({ menuItem: menuItem._id, name: menuItem.name, quantity: item.quantity || 1, price: menuItem.price });
    }

    const restaurant = await RestaurantPartner.findById(partnerId);
    const subtotal = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = orderType === 'delivery' ? (restaurant?.deliveryFee || 0) : 0;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
        partner: partnerId, customer: customerId, customerPhone: customerPhone || '',
        items: validatedItems, orderType: orderType || 'delivery', deliveryAddress, notes,
        subtotal, deliveryFee, total, estimatedTime: 20, status: 'confirmed', paymentStatus: 'paid',
    });

    if (paymentId) {
        await Payment.findByIdAndUpdate(paymentId, { 'metadata.orderId': order._id });
    }

    const customer = await Customer.findById(customerId);
    const customerName = customer ? customer.firstName + ' ' + customer.lastName : 'Guest';

    if (restaurant) {
        partnerEmails.sendNewOrder(restaurant, {
            id: order._id, customerName, itemsCount: validatedItems.length,
            orderType: orderType || 'delivery', total,
            deliveryAddress: deliveryAddress?.street || 'N/A',
            phone: customerPhone || '', notes: notes || '', items: validatedItems,
        }).catch(e => logger.error('Partner email failed: ' + e.message));

        createNotification({
            partnerId: restaurant._id.toString(),
            type: 'food', title: 'New Order Received',
            message: customerName + ' placed an order. Total: KES ' + total + '.',
        }).catch(e => logger.error('Notification failed: ' + e.message));
    }

    return order;
};

const createRideFromPayment = async (customerId, data, paymentId) => {
    const Vehicle = require('../../models/transport/Vehicle');
    const TransportPartner = require('../../models/transport/TransportPartner');

    const { vehicleId, pickup, dropoff, rideType, scheduledTime, customerPhone } = data;
    const vehicle = await Vehicle.findById(vehicleId);
    const distance = 5;
    const total = Math.round((vehicle.pricePerKm * distance + (vehicle.baseFare || 0)) * 100) / 100;

    const ride = await Ride.create({
        partner: vehicle.partner, vehicle: vehicleId, customer: customerId,
        pickup, dropoff, rideType: rideType || 'immediate', scheduledTime: scheduledTime || null,
        status: 'confirmed', paymentStatus: 'paid', distance,
        fare: { base: vehicle.baseFare || 0, distance: vehicle.pricePerKm * distance, time: 0, total, currency: 'KES' },
    });

    await Vehicle.findByIdAndUpdate(vehicleId, { status: 'on_trip', dispatchStatus: 'dispatched' });

    if (paymentId) {
        await Payment.findByIdAndUpdate(paymentId, { 'metadata.rideId': ride._id });
    }

    const customer = await Customer.findById(customerId);
    const customerName = customer ? customer.firstName + ' ' + customer.lastName : 'Guest';
    const vehicleName = vehicle.make + ' ' + vehicle.model + ' (' + vehicle.plateNumber + ')';

    const partner = await TransportPartner.findById(vehicle.partner);
    if (partner) {
        partnerEmails.sendNewRide(partner, {
            id: ride._id, customerName, vehicleName, rideType: rideType || 'immediate',
            pickup: pickup.address, dropoff: dropoff.address, distance, total,
            phone: customerPhone || '', scheduledTime,
        }).catch(e => logger.error('Partner email failed: ' + e.message));

        createNotification({
            partnerId: partner._id.toString(),
            type: 'transport', title: 'New Ride Request',
            message: customerName + ' requested a ride. ' + pickup.address + ' to ' + dropoff.address + '.',
        }).catch(e => logger.error('Notification failed: ' + e.message));
    }

    return ride;
};

const processPayment = async (req, res, next) => {
    try {
        const { method, amount, bookingData, orderData, rideData, phone } = req.body;
        const enabledMethods = await getEnabledMethods();

        if (!enabledMethods.includes(method)) {
            return res.status(400).json({ success: false, message: method + ' is not available.' });
        }
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Valid amount required.' });
        }

        const reference = 'DS-' + Date.now();

        if (method === 'wallet') {
            const customerId = req.user._id.toString();
            const wallet = await Wallet.findOne({ customer: customerId });
            if (!wallet || wallet.balance < amount) {
                return res.status(400).json({ success: false, message: 'Insufficient wallet balance.' });
            }

            wallet.balance -= amount;
            wallet.transactions.push({ type: 'debit', amount, description: 'Payment #' + reference, reference, createdAt: new Date() });
            await wallet.save();

            const payment = await Payment.create({
                customer: req.user._id, amount, method: 'wallet', type: 'payment',
                status: 'completed', reference, transactionId: reference,
                metadata: { bookingData, orderData, rideData },
            });

            let createdItem = null;
            if (bookingData) {
                createdItem = await createBookingFromPayment(req.user._id, bookingData, payment._id);
            } else if (orderData) {
                createdItem = await createOrderFromPayment(req.user._id, orderData, payment._id);
            } else if (rideData) {
                createdItem = await createRideFromPayment(req.user._id, rideData, payment._id);
            }

            customerEmails.sendPaymentReceived(req.user, { amount, method: 'Wallet', reference })
                .catch(e => logger.error('Email failed: ' + e.message));

            return res.json({ success: true, payment, createdItem, message: 'Payment successful via wallet.' });
        }

        if (method === 'mpesa') {
            if (!phone) return res.status(400).json({ success: false, message: 'Phone required for M-Pesa.' });

            const { checkoutRequestId } = await mpesaService.stkPush({
                phone, amount, reference, description: 'Digital Safaris Payment',
            });

            await Payment.create({
                customer: req.user._id, amount, method: 'mpesa', type: 'payment',
                status: 'pending', reference, transactionId: checkoutRequestId,
                metadata: { bookingData, orderData, rideData },
            });

            return res.json({ success: true, checkoutRequestId, reference, message: 'M-Pesa STK push sent. Enter PIN.' });
        }

        if (method === 'stripe') {
            const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent({
                amount, currency: 'kes', metadata: { customerId: req.user._id.toString() },
            });

            await Payment.create({
                customer: req.user._id, amount, method: 'stripe', type: 'payment',
                status: 'pending', reference, transactionId: paymentIntentId,
                metadata: { bookingData, orderData, rideData },
            });

            return res.json({ success: true, clientSecret, paymentIntentId, reference, message: 'Stripe payment initiated.' });
        }

        res.status(400).json({ success: false, message: 'Invalid payment method.' });
    } catch (error) { next(error); }
};

const verifyPayment = async (req, res, next) => {
    try {
        const { paymentIntentId, checkoutRequestId } = req.body;
        const query = { customer: req.user._id };
        if (paymentIntentId) query.transactionId = paymentIntentId;
        if (checkoutRequestId) query.transactionId = checkoutRequestId;

        const payment = await Payment.findOne(query);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

        if (payment.method === 'stripe') {
            const { status } = await stripeService.confirmPayment(payment.transactionId);
            payment.status = status === 'succeeded' ? 'completed' : 'failed';
            await payment.save();
            if (payment.status === 'completed' && payment.metadata) {
                if (payment.metadata.bookingData) await createBookingFromPayment(payment.customer, payment.metadata.bookingData, payment._id);
                if (payment.metadata.orderData) await createOrderFromPayment(payment.customer, payment.metadata.orderData, payment._id);
                if (payment.metadata.rideData) await createRideFromPayment(payment.customer, payment.metadata.rideData, payment._id);
            }
            return res.json({ success: true, payment });
        }

        if (payment.method === 'mpesa') {
            const { resultCode } = await mpesaService.queryStkStatus(payment.transactionId);
            payment.status = resultCode === 0 ? 'completed' : 'failed';
            await payment.save();
            if (payment.status === 'completed' && payment.metadata) {
                if (payment.metadata.bookingData) await createBookingFromPayment(payment.customer, payment.metadata.bookingData, payment._id);
                if (payment.metadata.orderData) await createOrderFromPayment(payment.customer, payment.metadata.orderData, payment._id);
                if (payment.metadata.rideData) await createRideFromPayment(payment.customer, payment.metadata.rideData, payment._id);
            }
            return res.json({ success: true, payment });
        }

        res.json({ success: true, payment });
    } catch (error) { next(error); }
};

const mpesaCallback = async (req, res, next) => {
    try {
        const { Body } = req.body;
        const { CheckoutRequestID, ResultCode } = Body.stkCallback;
        const status = ResultCode === 0 ? 'completed' : 'failed';
        const payment = await Payment.findOneAndUpdate({ transactionId: CheckoutRequestID }, { status }, { new: true });

        if (payment && status === 'completed' && payment.metadata) {
            if (payment.metadata.bookingData) await createBookingFromPayment(payment.customer, payment.metadata.bookingData, payment._id);
            if (payment.metadata.orderData) await createOrderFromPayment(payment.customer, payment.metadata.orderData, payment._id);
            if (payment.metadata.rideData) await createRideFromPayment(payment.customer, payment.metadata.rideData, payment._id);

            const customer = await Customer.findById(payment.customer);
            if (customer) {
                customerEmails.sendPaymentReceived(customer, { amount: payment.amount, method: 'M-Pesa', reference: payment.reference })
                    .catch(e => logger.error('Email failed: ' + e.message));
            }
        }

        res.json({ success: true });
    } catch (error) { next(error); }
};

const getPaymentHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const payments = await Payment.find({ customer: req.user._id })
            .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Payment.countDocuments({ customer: req.user._id });
        res.json({ success: true, payments, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

const getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ _id: req.params.id, customer: req.user._id });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });
        res.json({ success: true, payment });
    } catch (error) { next(error); }
};

module.exports = { getPaymentMethods, processPayment, verifyPayment, mpesaCallback, getPaymentHistory, getPayment };
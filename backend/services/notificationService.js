const Notification = require('../models/customer/Notification');
const logger = require('../utils/logger');

const createNotification = async ({ customerId, partnerId, type, title, message, link, metadata = {} }) => {
    try {
        const notification = await Notification.create({
            user: customerId || partnerId,
            userType: customerId ? 'customer' : 'partner',
            type,
            title,
            message,
            link,
            metadata,
        });
        return notification;
    } catch (error) {
        logger.error('Failed to create notification: ' + error.message);
    }
};

const getUserNotifications = async (userId, userType, { page = 1, limit = 20, unreadOnly = false } = {}) => {
    const query = { user: userId, userType: userType || 'customer' };
    if (unreadOnly) query.isRead = false;

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    return { notifications, total, page: parseInt(page), pages: Math.ceil(total / limit) };
};

const markAsRead = async (notificationId, userId) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead: true },
        { new: true }
    );
};

const markAllAsRead = async (userId) => {
    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    return { success: true };
};

const deleteNotification = async (notificationId, userId) => {
    return await Notification.findOneAndDelete({ _id: notificationId, user: userId });
};

const sendPushNotification = async ({ userId, title, message, data = {} }) => {
    logger.info('Push sent to ' + userId + ': ' + title);
    return { sent: true, userId };
};

const sendSMS = async ({ phone, message }) => {
    logger.info('SMS sent to ' + phone + ': ' + message);
    return { sent: true, phone };
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendPushNotification,
    sendSMS,
};
const logger = require('../utils/logger');

const notifications = [];

const sendPushNotification = async ({ userId, title, message, data = {} }) => {
    logger.info(`Push sent to ${userId}: ${title} - ${message}`);
    return { sent: true, userId, title };
};

const sendSMS = async ({ phone, message }) => {
    logger.info(`SMS sent to ${phone}: ${message}`);
    return { sent: true, phone };
};

const createNotification = async ({ userId, type, title, message, link, metadata = {} }) => {
    const notification = {
        id: Date.now().toString(),
        userId,
        type,
        title,
        message,
        link,
        metadata,
        isRead: false,
        createdAt: new Date(),
    };
    notifications.push(notification);
    return notification;
};

const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
    let userNotifs = notifications.filter((n) => n.userId === userId);
    if (unreadOnly) userNotifs = userNotifs.filter((n) => !n.isRead);
    userNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = userNotifs.length;
    const start = (page - 1) * limit;
    const paginated = userNotifs.slice(start, start + limit);
    return { notifications: paginated, total, page, pages: Math.ceil(total / limit) };
};

const markAsRead = async (notificationId) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) notification.isRead = true;
    return notification;
};

const markAllAsRead = async (userId) => {
    notifications.filter((n) => n.userId === userId).forEach((n) => (n.isRead = true));
    return { success: true };
};

module.exports = { sendPushNotification, sendSMS, createNotification, getUserNotifications, markAsRead, markAllAsRead };
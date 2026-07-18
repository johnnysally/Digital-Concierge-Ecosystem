const { getUserNotifications, markAsRead, markAllAsRead } = require('../../services/notificationService');

const getNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, unreadOnly = false } = req.query;
        const response = await getUserNotifications(req.user._id.toString(), {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            unreadOnly: unreadOnly === 'true',
        });
        res.json({ success: true, ...response });
    } catch (error) {
        next(error);
    }
};

const markNotificationRead = async (req, res, next) => {
    try {
        const notification = await markAsRead(req.params.id);
        if (!notification || notification.userId !== req.user._id.toString()) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.json({ success: true, notification });
    } catch (error) {
        next(error);
    }
};

const markAllNotificationsRead = async (req, res, next) => {
    try {
        await markAllAsRead(req.user._id.toString());
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = { getNotifications, markNotificationRead, markAllNotificationsRead };
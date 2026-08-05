const { getUserNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../../services/notificationService');

const getNotifications = async (req, res, next) => {
    try {
        const result = await getUserNotifications(req.user._id.toString(), 'partner', req.query);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

const markOneAsRead = async (req, res, next) => {
    try {
        const notification = await markAsRead(req.params.id, req.user._id.toString());
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.json({ success: true, notification });
    } catch (error) { next(error); }
};

const markAllRead = async (req, res, next) => {
    try {
        await markAllAsRead(req.user._id.toString());
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) { next(error); }
};

const removeNotification = async (req, res, next) => {
    try {
        const notification = await deleteNotification(req.params.id, req.user._id.toString());
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) { next(error); }
};

module.exports = { getNotifications, markOneAsRead, markAllRead, removeNotification };
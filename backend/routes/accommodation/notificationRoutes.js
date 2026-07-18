const router = require('express').Router();
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');
const { getNotifications, markNotificationRead, markAllNotificationsRead } = require('../../controllers/accommodation/notificationController');

router.use(accommodationAuth);
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllNotificationsRead);

module.exports = router;

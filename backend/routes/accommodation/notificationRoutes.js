const router = require('express').Router();
const { getNotifications, markOneAsRead, markAllRead, removeNotification } = require('../../controllers/accommodation/notificationController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');

router.use(accommodationAuth);
router.get('/', getNotifications);
router.put('/:id/read', markOneAsRead);
router.put('/read-all', markAllRead);
router.delete('/:id', removeNotification);

module.exports = router;
const router = require('express').Router();
const { getNotifications, markOneAsRead, markAllRead, removeNotification } = require('../../controllers/restaurant/notificationController');
const restaurantAuth = require('../../middleware/restaurant/restaurantAuth');

router.use(restaurantAuth);
router.get('/', getNotifications);
router.put('/:id/read', markOneAsRead);
router.put('/read-all', markAllRead);
router.delete('/:id', removeNotification);

module.exports = router;
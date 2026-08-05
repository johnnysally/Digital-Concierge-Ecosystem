const router = require('express').Router();
const { getNotifications, markOneAsRead, markAllRead, removeNotification } = require('../../controllers/transport/notificationController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/', getNotifications);
router.put('/:id/read', markOneAsRead);
router.put('/read-all', markAllRead);
router.delete('/:id', removeNotification);

module.exports = router;
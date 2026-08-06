const router = require('express').Router();
const ctrl = require('../../controllers/transport/notificationController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/', ctrl.getNotifications);
router.put('/:id/read', ctrl.markOneAsRead);
router.put('/read-all', ctrl.markAllRead);
router.delete('/:id', ctrl.removeNotification);

module.exports = router;
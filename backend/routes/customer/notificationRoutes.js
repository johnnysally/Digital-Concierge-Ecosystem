const router = require('express').Router();
const { getNotifications, markOneAsRead, markAllRead, removeNotification } = require('../../controllers/customer/notificationController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.get('/', getNotifications);
router.put('/:id/read', markOneAsRead);
router.put('/read-all', markAllRead);
router.delete('/:id', removeNotification);

module.exports = router;
const router = require('express').Router();
const { sendMessage, getChatHistory,deleteMessage } = require('../../controllers/customer/chatController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.post('/', sendMessage);
router.get('/', getChatHistory);
router.delete('/:id', deleteMessage);

module.exports = router;
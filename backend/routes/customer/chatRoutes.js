const router = require('express').Router();
const { sendMessage, getChatHistory } = require('../../controllers/customer/chatController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.post('/', sendMessage);
router.get('/', getChatHistory);

module.exports = router;
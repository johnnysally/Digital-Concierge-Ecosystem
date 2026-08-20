const router = require('express').Router();
const { getSiteConfig } = require('../../controllers/web/configController');
const { sendChat } = require('../../controllers/web/aiChatController');
const { submitContact } = require('../../controllers/web/contactController');

router.get('/config', getSiteConfig);
router.post('/ai-chat', sendChat);
router.post('/contact', submitContact);

module.exports = router;
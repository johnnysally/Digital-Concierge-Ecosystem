const router = require('express').Router();
const { create, getMy } = require('../../controllers/customer/disputeController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.post('/', create);
router.get('/my', getMy);

module.exports = router;
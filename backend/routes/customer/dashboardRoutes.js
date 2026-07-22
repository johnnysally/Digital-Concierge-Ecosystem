const router = require('express').Router();
const { getDashboard } = require('../../controllers/customer/dashboardController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.get('/', getDashboard);

module.exports = router;
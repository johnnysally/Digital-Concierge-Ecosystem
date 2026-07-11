const router = require('express').Router();
const { getDashboardStats, getRevenueReport } = require('../../controllers/admin/reportController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.use(adminAuth);
router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueReport);

module.exports = router;
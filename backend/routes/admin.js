const router = require('express').Router();
const { adminLimiter } = require('../middleware/global/rateLimiter');

router.use(adminLimiter);

router.use('/auth', require('./admin/adminRoutes'));
router.use('/partners', require('./admin/partnerRoutes'));
router.use('/customers', require('./admin/customerRoutes'));
router.use('/transactions', require('./admin/transactionRoutes'));
router.use('/disputes', require('./admin/disputeRoutes'));
router.use('/reports', require('./admin/reportRoutes'));
router.use('/settings', require('./admin/settingsRoutes'));
router.use('/backups', require('./admin/backupRoutes'));
router.use('/legal', require('./admin/legalRoutes'));
router.use('/support', require('./admin/supportRoutes'));

module.exports = router;
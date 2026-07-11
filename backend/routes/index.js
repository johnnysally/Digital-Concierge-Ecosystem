const router = require('express').Router();

router.use('/public', require('./public'));
router.use('/customer', require('./customer'));
router.use('/accommodation', require('./accommodation'));
router.use('/restaurant', require('./restaurant'));
router.use('/transport', require('./transport'));
router.use('/admin', require('./admin'));

module.exports = router;
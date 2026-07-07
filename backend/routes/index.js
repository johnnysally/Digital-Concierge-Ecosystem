const router = require('express').Router();

router.use('/customer', require('./customer'));
router.use('/partner', require('./partner'));

module.exports = router;
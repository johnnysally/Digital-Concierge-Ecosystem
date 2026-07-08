const router = require('express').Router();

router.use('/customer', require('./customer'));

module.exports = router;
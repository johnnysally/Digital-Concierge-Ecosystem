const router = require('express').Router();

router.use('/auth', require('./restaurant/restaurantRoutes'));
router.use('/menu', require('./restaurant/menuRoutes'));
router.use('/orders', require('./restaurant/orderRoutes'));
router.use('/staff', require('./restaurant/staffRoutes'));
router.use('/promotions', require('./restaurant/promotionRoutes'));

module.exports = router;
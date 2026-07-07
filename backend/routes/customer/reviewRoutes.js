const router = require('express').Router();
const { createReview, getPropertyReviews, getMyReviews } = require('../../controllers/customer/reviewController');
const customerAuth = require('../../middleware/customer/customerAuth');
const { reviewRules } = require('../../middleware/customer/customerValidate');

router.get('/property/:propertyId', getPropertyReviews);

router.use(customerAuth);
router.post('/', reviewRules, createReview);
router.get('/', getMyReviews);

module.exports = router;
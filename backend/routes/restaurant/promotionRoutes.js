const router = require('express').Router();
const { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion } = require('../../controllers/restaurant/promotionController');
const restaurantAuth = require('../../middleware/restaurant/restaurantAuth');
const { promotionRules } = require('../../middleware/restaurant/restaurantValidate');

router.use(restaurantAuth);
router.post('/', promotionRules, createPromotion);
router.get('/', getPromotions);
router.get('/:id', getPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

module.exports = router;
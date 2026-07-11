const router = require('express').Router();
const { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion } = require('../../controllers/accommodation/promotionController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');
const { promotionRules } = require('../../middleware/accommodation/accommodationValidate');

router.use(accommodationAuth);
router.post('/', promotionRules, createPromotion);
router.get('/', getPromotions);
router.get('/:id', getPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

module.exports = router;
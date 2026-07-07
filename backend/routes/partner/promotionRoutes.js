const router = require('express').Router();
const { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion } = require('../../controllers/partner/promotionController');
const partnerAuth = require('../../middleware/partner/partnerAuth');
const { promotionRules } = require('../../middleware/partner/partnerValidate');

router.use(partnerAuth);
router.post('/', promotionRules, createPromotion);
router.get('/', getPromotions);
router.get('/:id', getPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

module.exports = router;
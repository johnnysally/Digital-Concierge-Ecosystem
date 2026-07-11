const router = require('express').Router();
const { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion } = require('../../controllers/transport/promotionController');
const transportAuth = require('../../middleware/transport/transportAuth');
const { promotionRules } = require('../../middleware/transport/transportValidate');

router.use(transportAuth);
router.post('/', promotionRules, createPromotion);
router.get('/', getPromotions);
router.get('/:id', getPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

module.exports = router;
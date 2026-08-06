const router = require('express').Router();
const ctrl = require('../../controllers/transport/promotionController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/', ctrl.getPromotions);
router.post('/', ctrl.createPromotion);
router.get('/reviews', ctrl.getReviews);
router.get('/:id', ctrl.getPromotion);
router.put('/:id', ctrl.updatePromotion);
router.delete('/:id', ctrl.deletePromotion);

module.exports = router;
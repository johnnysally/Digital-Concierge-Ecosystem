const router = require('express').Router();
const ctrl = require('../../controllers/transport/pricingController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.post('/calculate', transportAuth, ctrl.calculateFare);
router.use(transportAuth);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
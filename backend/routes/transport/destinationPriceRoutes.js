const router = require('express').Router();
const ctrl = require('../../controllers/transport/destinationPriceController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.get('/', transportAuth, ctrl.getAll);
router.post('/calculate', transportAuth, ctrl.calculateFare);
router.post('/', transportAuth, ctrl.create);
router.put('/:id', transportAuth, ctrl.update);
router.delete('/:id', transportAuth, ctrl.remove);

module.exports = router;
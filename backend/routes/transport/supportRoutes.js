const router = require('express').Router();
const ctrl = require('../../controllers/transport/supportController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/info', ctrl.getSupportInfo);
router.post('/', ctrl.createTicket);
router.get('/', ctrl.getMyTickets);
router.get('/:id', ctrl.getTicket);

module.exports = router;
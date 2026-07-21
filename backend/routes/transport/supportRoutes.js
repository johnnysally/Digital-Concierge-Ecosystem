const router = require('express').Router();
const { getSupportInfo, createTicket, getMyTickets, getTicket } = require('../../controllers/transport/supportController');
const transportAuth = require('../../middleware/transport/transportAuth');

router.use(transportAuth);
router.get('/info', getSupportInfo);
router.post('/', createTicket);
router.get('/', getMyTickets);
router.get('/:id', getTicket);

module.exports = router;
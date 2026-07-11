const router = require('express').Router();
const { createTicket, getMyTickets, getTicket } = require('../../controllers/customer/supportController');
const customerAuth = require('../../middleware/customer/customerAuth');

router.use(customerAuth);
router.post('/', createTicket);
router.get('/', getMyTickets);
router.get('/:id', getTicket);

module.exports = router;
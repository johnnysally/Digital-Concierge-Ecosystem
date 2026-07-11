const router = require('express').Router();
const { getAllTickets, getTicket, updateTicket } = require('../../controllers/admin/supportController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.use(adminAuth);
router.get('/', getAllTickets);
router.get('/:id', getTicket);
router.put('/:id', updateTicket);

module.exports = router;
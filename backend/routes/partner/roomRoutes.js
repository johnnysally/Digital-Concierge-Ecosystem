const router = require('express').Router();
const { createRoom, getRooms, getRoom, updateRoom, deleteRoom } = require('../../controllers/partner/roomController');
const partnerAuth = require('../../middleware/partner/partnerAuth');
const { roomRules } = require('../../middleware/partner/partnerValidate');

router.use(partnerAuth);
router.post('/', roomRules, createRoom);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
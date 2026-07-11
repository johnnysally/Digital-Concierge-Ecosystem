const router = require('express').Router();
const { createRoom, getRooms, getRoom, updateRoom, deleteRoom } = require('../../controllers/accommodation/roomController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');
const { roomRules } = require('../../middleware/accommodation/accommodationValidate');

router.use(accommodationAuth);
router.post('/', roomRules, createRoom);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
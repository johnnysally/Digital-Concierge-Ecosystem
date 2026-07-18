const router = require('express').Router();
const { createRoom, getRooms, getRoom, updateRoom, deleteRoom, uploadRoomImages } = require('../../controllers/accommodation/roomController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');
const { roomRules } = require('../../middleware/accommodation/accommodationValidate');
const upload = require('../../middleware/global/upload');

router.use(accommodationAuth);
router.post('/', roomRules, createRoom);
router.post('/upload-images', upload.array('images', 8), uploadRoomImages);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
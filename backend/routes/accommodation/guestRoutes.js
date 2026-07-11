const router = require('express').Router();
const { getGuests, getGuest } = require('../../controllers/accommodation/guestController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');

router.use(accommodationAuth);
router.get('/', getGuests);
router.get('/:id', getGuest);

module.exports = router;
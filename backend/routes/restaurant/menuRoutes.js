const router = require('express').Router();
const { createItem, getItems, getItem, updateItem, deleteItem } = require('../../controllers/restaurant/menuController');
const restaurantAuth = require('../../middleware/restaurant/restaurantAuth');
const { menuRules } = require('../../middleware/restaurant/restaurantValidate');

router.use(restaurantAuth);
router.post('/', menuRules, createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
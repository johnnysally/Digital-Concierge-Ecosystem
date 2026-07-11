const router = require('express').Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../../controllers/accommodation/housekeepingController');
const accommodationAuth = require('../../middleware/accommodation/accommodationAuth');

router.use(accommodationAuth);
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
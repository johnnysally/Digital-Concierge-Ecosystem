const router = require('express').Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../../controllers/partner/housekeepingController');
const partnerAuth = require('../../middleware/partner/partnerAuth');

router.use(partnerAuth);
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
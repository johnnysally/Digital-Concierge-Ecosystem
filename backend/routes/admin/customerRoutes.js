const router = require('express').Router();
const { getAllCustomers, getCustomer, suspendCustomer, activateCustomer, deleteCustomer } = require('../../controllers/admin/customerController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.use(adminAuth);
router.get('/', getAllCustomers);
router.get('/:id', getCustomer);
router.put('/:id/suspend', suspendCustomer);
router.put('/:id/activate', activateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
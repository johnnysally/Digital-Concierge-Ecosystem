const router = require('express').Router();
const ctrl = require('../../controllers/admin/townController');
const adminAuth = require('../../middleware/admin/adminAuth');

router.use(adminAuth);
router.post('/towns', ctrl.createTown);
router.get('/towns', ctrl.getTowns);
router.get('/towns/:id', ctrl.getTown);
router.put('/towns/:id', ctrl.updateTown);
router.delete('/towns/:id', ctrl.deleteTown);

router.post('/destinations', ctrl.createDestination);
router.get('/destinations', ctrl.getDestinations);
router.put('/destinations/:id', ctrl.updateDestination);
router.delete('/destinations/:id', ctrl.deleteDestination);

module.exports = router;
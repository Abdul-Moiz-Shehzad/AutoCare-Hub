const express = require('express');
const router = express.Router();
const {
  getVehicles,
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getServices,
  bookService,
  rateService
} = require('../controllers/customerController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('customer'));

router.route('/vehicles').get(getVehicles).post(addVehicle);
router.route('/vehicles/:id').delete(deleteVehicle).put(updateVehicle);
router.route('/services').get(getServices).post(bookService);
router.route('/services/:id/rate').put(rateService);

module.exports = router;

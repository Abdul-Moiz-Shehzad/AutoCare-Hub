const express = require('express');
const router = express.Router();
const {
  createMechanic,
  getMechanics,
  getRequests,
  assignMechanic,
  getDashboardStats,
} = require('../controllers/managerController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes here require Manager role
router.use(protect);
router.use(authorize('manager'));

router.route('/mechanics').post(createMechanic).get(getMechanics);
router.route('/requests').get(getRequests);
router.route('/requests/:id/assign').put(assignMechanic);
router.route('/dashboard-stats').get(getDashboardStats);

module.exports = router;

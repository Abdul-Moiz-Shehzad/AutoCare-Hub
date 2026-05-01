const express = require('express');
const router = express.Router();
const {
  createMechanic,
  getMechanics,
  deleteMechanic,
  getRequests,
  assignMechanic,
  updateServicePriority,
  getDashboardStats,
  reviewServiceRequest,
  markAsReceived,
  markAsPickedUp,
} = require('../controllers/managerController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes here require Manager role
router.use(protect);
router.use(authorize('manager'));

router.route('/mechanics').post(createMechanic).get(getMechanics);
router.route('/mechanics/:id').delete(deleteMechanic);
router.route('/requests').get(getRequests);
router.route('/requests/:id/assign').put(assignMechanic);
router.route('/requests/:id/priority').put(updateServicePriority);
router.route('/requests/:id/receive').put(markAsReceived);
router.route('/requests/:id/review').put(reviewServiceRequest);
router.route('/requests/:id/pickup').put(markAsPickedUp);
router.route('/dashboard-stats').get(getDashboardStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getMyJobs, updateJobStatus, addJobNote, addJobMilestone, updateJobLog } = require('../controllers/mechanicController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('mechanic'));

router.get('/jobs', getMyJobs);
router.put('/jobs/:id/status', updateJobStatus);
router.put('/jobs/:id/notes', addJobNote);
router.put('/jobs/:id/milestones', addJobMilestone);
router.put('/jobs/:id/logs', updateJobLog);

module.exports = router;

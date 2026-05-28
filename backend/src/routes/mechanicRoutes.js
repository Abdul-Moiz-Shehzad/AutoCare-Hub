const express = require('express');
const router = express.Router();
const { getMyJobs, updateJobStatus, addJobNote } = require('../controllers/mechanicController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('mechanic'));

router.get('/jobs', getMyJobs);
router.put('/jobs/:id/status', updateJobStatus);
router.put('/jobs/:id/notes', addJobNote);

module.exports = router;

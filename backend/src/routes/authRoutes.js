const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, changePassword, changePhone, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/change-password', protect, changePassword);
router.put('/change-phone', protect, changePhone);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;

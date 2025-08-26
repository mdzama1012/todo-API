const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const {
    createAccount,
    loginAccount,
    getTodayProgress,
    getAccountSummary,
} = require('../controllers/userControllers');

const router = express.Router();

router.post('/signup', createAccount);

router.post('/login', loginAccount);

router.get('/progress', auth, getTodayProgress);

router.get('/basic-details', auth, getAccountSummary);

module.exports = router;

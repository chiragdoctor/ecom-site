const express = require('express');
const router = express.Router();
const { userSignupValidator } = require('../validator/index');

const { signup } = require('../controllers/user');

router.post('/signup', userSignupValidator, signup);

module.exports = router;

const express = require('express');
const router = express.Router();
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');

const { create, categoryById, read } = require('../controllers/category');
const { userById } = require('../controllers/user');

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);

router.get('/category/:categoryId', read);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;

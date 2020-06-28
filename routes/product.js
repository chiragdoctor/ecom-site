const express = require('express');
const router = express.Router();
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');

const { create, productById, read, remove } = require('../controllers/product');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', remove);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);

router.param('userId', userById);
router.param('productId', productById);
module.exports = router;

const express = require('express');
const router = express.Router();
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');

const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
  listSearch,
} = require('../controllers/product');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read);

router.get('/products/search', listSearch);

router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove,
);

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);

router.put(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update,
);

router.get('/products', list);

router.get('/products/related/:productId', listRelated);

router.get('/products/categories', listCategories);

router.post('/products/by/search', listBySearch);

router.get('/products/photo/:productId', photo);

router.param('userId', userById);
router.param('productId', productById);
module.exports = router;

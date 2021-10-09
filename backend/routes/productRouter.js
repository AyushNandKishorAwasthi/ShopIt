const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const authUser = require('../middlewares/authUser');

router.route('/product/:id').get(productController.getSingleProduct);
router.route('/products').get(productController.getProducts);
router.route('/admin/products').get(authUser.authenticUser, authUser.authRoles('admin'), productController.getProducts);

router
  .route('/admin/product/new')
  .post(authUser.authenticUser, authUser.authRoles('admin'), productController.newProduct);
router
  .route('/admin/product/:id')
  .put(authUser.authenticUser, authUser.authRoles('admin'), productController.updateProduct)
  .delete(authUser.authenticUser, authUser.authRoles('admin'), productController.deleteProduct);
router.route('/review/:id').put(authUser.authenticUser, reviewController.createOrUpdateReview);
router.route('/review/product/:id').get(authUser.authenticUser, reviewController.getAllReviews);
router.route('/admin/review/all/product').get(authUser.authenticUser, authUser.authRoles('admin'), reviewController.getAllReviews);
router.route('/product/:id/review').delete(authUser.authenticUser, reviewController.deleteReview);
module.exports = router;

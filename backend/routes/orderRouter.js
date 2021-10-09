const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/authUser');
const orderController = require('../controllers/orderController');
router.route('/order/new').post(authUser.authenticUser, orderController.newOrder);
router.route('/order/:id').get(authUser.authenticUser, orderController.getAnOrder);
router.route('/orders/me').get(authUser.authenticUser, orderController.getMyOrder);
router.route('/admin/orders').get(authUser.authenticUser, authUser.authRoles('admin'), orderController.getAllOrders);
router
  .route('/admin/order/:id')
  .put(authUser.authenticUser, authUser.authRoles('admin'), orderController.updateOrderProcess)
  .delete(authUser.authenticUser, authUser.authRoles('admin'), orderController.deleteOrder);
module.exports = router;

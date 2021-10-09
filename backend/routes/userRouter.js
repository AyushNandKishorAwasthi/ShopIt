const authController = require('../controllers/authController');
const authUser = require('../middlewares/authUser');
const express = require('express');
const router = express.Router();

router.route('/register').post(authController.registerUser);
router.route('/me').get(authUser.authenticUser, authController.getCurrentUser);
router.route('/admin/allUsers').get(authUser.authenticUser, authUser.authRoles('admin'), authController.getAllUsers);
router
  .route('/admin/user/:id')
  .get(authUser.authenticUser, authUser.authRoles('admin'), authController.getUser)
  .put(authUser.authenticUser, authUser.authRoles('admin'), authController.updateUser)
  .delete(authUser.authenticUser, authUser.authRoles('admin'), authController.deleteUser);
router.route('/updatePassword').post(authUser.authenticUser, authController.updatePassword);
router.route('/updateMe').put(authUser.authenticUser, authController.updateMe);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);
module.exports = router;

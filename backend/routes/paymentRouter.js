const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/authUser');
const paymentController = require('../controllers/paymentController');
router.route('/payment/process').post(paymentController.processPayment);
router.route('/stripeApiKey').get(paymentController.sendStripeClient);
module.exports = router;

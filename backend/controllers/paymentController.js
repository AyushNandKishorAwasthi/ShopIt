const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CatchAsync = require('../middlewares/catchAsync');

exports.processPayment = CatchAsync(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'inr',
    metadata: { integration_Check: 'accept_a_payment' },
  });
  // console.log(paymentIntent);
  res.status(200).json({
    success: 'true',
    client_Secret: paymentIntent.client_secret,
  });
});

exports.sendStripeClient = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    success: 'true',
    stripe_Key: process.env.STRIPE_PUBLISH_KEY,
  });
});

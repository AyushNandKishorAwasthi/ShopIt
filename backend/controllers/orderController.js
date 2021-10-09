const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const CatchAsync = require('../middlewares/catchAsync');

exports.newOrder = CatchAsync(async (req, res, next) => {
  const { orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = req.body;
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });
  res.status(200).json({
    success: 'true',
    order,
  });
});

exports.getAnOrder = CatchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return next(new ErrorHandler('Order does not exists', 404));
  res.status(200).json({
    success: 'true',
    order,
  });
});

exports.getMyOrder = CatchAsync(async (req, res, next) => {
  const order = await Order.find({ user: req.user.id });
  if (!order) return next(new ErrorHandler('Order does not exists', 404));
  res.status(200).json({
    success: 'true',
    order,
  });
});

exports.getAllOrders = CatchAsync(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: 'true',
    totalAmount,
    orders,
  });
});

exports.deleteOrder = CatchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndRemove(req.params.id);
  if (!order) return next(new ErrorHandler('Order does not exists', 400));
  res.status(200).json({
    success:'true',
    message:'Order Removed Successfully'
  });
});

exports.updateOrderProcess = CatchAsync(async (req, res, next) => {
  //1 get orderid and find that order
  console.log('orderStatus',req.body.orderStatus);
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler('Order does not exists', 400));
  if (order.orderStatus === 'Delivered') return next(new ErrorHandler('Order once "Deliverd" can not be processed again.', 400));
  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });
  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({
    success: 'true',
    message: 'Order updated successfully',
  });
});

const updateStock = async (productId, productQuantity) => {
  const product = await Product.findById(productId);
  product.stock -= productQuantity;
  await product.save({ validateBeforSave: false });
};

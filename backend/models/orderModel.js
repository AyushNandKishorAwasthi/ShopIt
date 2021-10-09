const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, 'Please enter delivery address'],
    },
    phone: {
      type: Number,
      required: [true, 'Please enter contact number'],
    },
    city: {
      type: String,
      required: [true, 'Please enter city name '],
    },
    postCode: {
      type: Number,
      required: [true, 'Please enter zip/pin code'],
    },
    country: {
      type: String,
      required: [true, 'Please enter country'],
    },
  },
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.ObjectId,
        ref: 'Product',
      },
    },
  ],
  paidAt: {
    type: Date,
  },
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing',
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);

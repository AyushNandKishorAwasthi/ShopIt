const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name of product'],
    trim: true,
    maxLength: [100, 'Product name can not exceed 100 characters'],
  },
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  price: {
    type: Number,
    required: [true, 'Please enter price of product'],
    maxLength: [5, 'Product price can not exceed 5 digits'],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, 'Please enter description of product'],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please select a category for this product'],
    enum: {
      values: [
        'Electronics',
        'Cameras',
        'Laptops',
        'Headphones',
        'Accessories',
        'Food',
        'Books',
        'Mobile',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home',
      ],
      message: 'Please select a correct category for this product',
    },
  },
  seller: {
    type: String,
    required: [true, 'Please enter product seller'],
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Product stock value cannot exceed 5 digit'],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews:[{
      type:mongoose.ObjectId,
      ref:'Reviews'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);

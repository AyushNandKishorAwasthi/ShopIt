const Product = require('../models/productModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const product = require('../data/products.json');
dotenv.config({ path: 'backend/config/config.env' });
connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('Products deleted');
    await Product.insertMany(product);
    console.log('Products inserted');
    process.exit(0);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
seedProducts();

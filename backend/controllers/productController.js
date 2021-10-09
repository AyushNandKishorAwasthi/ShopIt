const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../middlewares/catchAsync');
const cloudinary = require('cloudinary');
const ErrorHandler = require('../utils/errorHandler');

exports.newProduct = catchAsync(async (req, res, next) => {
  if (!req.body.images) return next(new ErrorHandler('Please upload image'));
  const imageArry = typeof req.body.images !== 'string' ? req.body.images : [req.body.images];
  let resultAll = imageArry.map((image) => {
    return cloudinary.v2.uploader.upload(image, {
      folder: 'products',
      scale: 'fit',
      width: 510,
      height: 640,
    });
  });
  const resultPromisify = await Promise.all(resultAll);

  const product = await Product.create({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    seller: req.body.seller,
    description: req.body.description,
    category: req.body.category,
    images: resultPromisify.map((result) => {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }),
  });
  res.status(201).json({
    success: 'true',
    product,
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  // return next(new ErrorHandler('My generilia errorra', 400));
  // check if the request is coming from admin
  let resPerPage;
  if (req.path !== '/admin/products') resPerPage = 4;
  const productCount = await Product.countDocuments();
  const r = new ApiFeatures(Product.find(),req.query).search();
  const searchProducts = await r.query;
  const features = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resPerPage);
  const products = await features.query;

  res.status(200).json({
    success: 'true',
    productCount,
    resPerPage,
    results: searchProducts.length,
    products,
  });
});

exports.getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('reviews');

  if (!product) return next(new ErrorHandler('Product not found', 404));

  return res.status(200).json({
    success: 'true',
    product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Product not found', 404));
  /* if (!req.body.images) return next(new ErrorHandler('Please upload image'));
  console.log(); */
  let oldImages;
  if (req.body.oldImages) {
    oldImages = typeof req.body.oldImages !== 'string' ? req.body.oldImages : [req.body.oldImages];
  }
  const removeThese = oldImages ? oldImages.map((image) => JSON.stringify(image)) : undefined;
  
  let saveThese;
  if (!removeThese || removeThese) {
    saveThese = product.images.map((image) => {
      return {
        public_id: image.public_id,
        url: image.url,
      };
    });
    saveThese = removeThese
      ? saveThese.filter((images) => !removeThese.includes(JSON.stringify(images.public_id)))
      : saveThese;
  }
  

  if (removeThese) {
    
    removeThese.forEach(async (public_id) => {
      await cloudinary.v2.uploader.destroy(JSON.parse(public_id));
    });
  }

  let imageArry = typeof req.body.images !== 'string' ? req.body.images : [req.body.images];
  if (imageArry) {
    
    const resultAll = imageArry.map((image) => {
      return cloudinary.v2.uploader.upload(image, {
        folder: 'products',
        scale: 'fit',
        width: 510,
        height: 640,
      });
    });

    const resultPromisify = await Promise.all(resultAll);
    imageArry = resultPromisify.map((result) => {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    });
  }
  req.body.images = imageArry ? [...imageArry, ...saveThese] : [...saveThese];
  console.log('req.body.images=>', req.body.images);
  // return next(new ErrorHandler('Testing', 403));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  console.log(product);
  return res.status(200).json({
    success: 'true',
    product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Product not found', 404));

  product.images.forEach(async (image) => {
    await cloudinary.v2.uploader.destroy(image.public_id);
  });

  await product.remove();
  return res.status(200).json({
    success: 'true',
    message: 'Product deleted',
  });
});

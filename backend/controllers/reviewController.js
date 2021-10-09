const Product = require('../models/productModel');
const Reviews = require('../models/reviewModel');
const CatchAsync = require('../middlewares/catchAsync');
const ErrorHandler = require('../utils/errorHandler');

exports.createOrUpdateReview = CatchAsync(async (req, res, next) => {
  //1 find product
  const user = req.user.id;
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Product does not exists', 400));

  modifyDeleteReview(product, req, res, next, { update: true });
});

exports.getAllReviews = CatchAsync(async (req, res, next) => {
  if(req.user.role!=='admin'){
    const reviews = await Reviews.find({product:req.params.id});
    if (!reviews) return next(new ErrorHandler('Product not found', 404));
    res.status(200).json({
      success: 'true',
      reviews,
    });
  }
  else{
    const reviews = await Reviews.find();
    if (!reviews) return next(new ErrorHandler('Product not found', 404));
    res.status(200).json({
      success: 'true',
      reviews
    });
  }
});

exports.deleteReview = CatchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Product not found', 404));
  modifyDeleteReview(product, req, res, next, { delete: true });
});

const modifyDeleteReview = async (product, req, res, next, option = { update: false, delete: false }) => {
  //2 check if user already reviwed the product
  if (option.update) {
    let review = await Reviews.findOne({$and:[{user:req.user.id},{product:product._id}]});
    if (!review) {
      const review = await Reviews.create({
        product: product._id,
        name: req.user.name,
        user: req.user.id,
        comment: req.body.comment,
        rating: req.body.rating * 1,
      });
      product.reviews.push(review._id);
      product.numOfReviews=product.reviews.length;
      product.ratings = (product.ratings+review.rating)/product.numOfReviews; 
      await product.save();
      return res.status(200).json({
        success: 'true',
        review,
      });
    }
    if (review) {
      review.comment = req.body.comment ? req.body.comment : review.comment;
      review.rating = req.body.rating ? req.body.rating : review.rating;
      await review.save();
      return res.status(200).json({
        success: 'true',
        review,
      });
    }
  }
  if (option.delete) {
    const review = await Reviews.findByIdAndDelete(req.query.id);
    if(!review) return next (new ErrorHandler('Review already removed',404));
    product.reviews.pull(req.query.id);
    product.numOfReviews=product.reviews.length;
    product.ratings = (product.ratings+review.rating)/product.numOfReviews;
    await product.save();
    return res.status(200).json({
      success: 'true',
      // reviewsLength: product.numOfReviews,
      message:'Review Removed',
    });
  }

  // product.numOfReviews = product.reviews.length;
  // product.ratings = product.reviews.reduce((sum, item) => item.rating + sum, 0) 
};

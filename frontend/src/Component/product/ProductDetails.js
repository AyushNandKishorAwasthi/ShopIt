import React, { useEffect, useState, Fragment } from 'react';
import { addItem } from '../../actions/cartActions';
import CurrencyINR from '../../constants/currency';
import { getProductDetails, clearErrors, newReview } from '../../actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Carousel } from 'react-bootstrap';
import ListReview from '../reviews/ListReview';
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
const ProductDetails = ({ match }) => {
  const alert = useAlert();
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const { error: reviewError, success } = useSelector((state) => state.newReview);
  const { product, loading, error } = useSelector((state) => state.productDetails);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector(state=>state.cart);
  const item = cartItems.find(item=>item.product===product._id);
  const [qt, setQt] = useState((item && item.quantity)||1);
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success('Review posted successfully');
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, error, success, alert, reviewError, match.params.id]);

  const incrementQt = () => {
    const count = document.querySelector('.count').valueAsNumber;
    if (count >= product.stock) return;
    setQt(count + 1);
  };
  const decrementQt = () => {
    const count = document.querySelector('.count').valueAsNumber;
    if (count <= 1) return;
    setQt(count - 1);
  };

  const addToCart = () => {
    if (product.stock < 1) return;
    if(qt===(item&&item.quantity))
    alert.success('Item quantity allready added')
    else{
      dispatch(addItem(product, qt));
      alert.success('Added to cart');
    }

  };

  function userRatings() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, i) => {
      star.starValue = i + 1;
      ['click', 'mouseover', 'mouseout'].forEach((e) => {
        star.addEventListener(e, showRatings);
      });
    });
    function showRatings(e) {
      stars.forEach((star, i) => {
        if (e.type === 'click') {
          if (i < this.starValue) {
            star.classList.add('orange');
            setRating(this.starValue);
          } else {
            star.classList.remove('orange');
          }
        }
        if (e.type === 'mouseover')
          if (i < this.starValue) star.classList.add('yellow');
          else star.classList.remove('yellow');
        if (e.type === 'mouseout') star.classList.remove('yellow');
      });
    }
  }
  const reviewHandler = () => {
    const formData = new FormData();
    formData.set('comment', comment);
    formData.set('rating', rating);
    dispatch(newReview(match.params.id, formData));
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={(product&&product.name) ||'Only the excellent products'} />
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images &&
                  product.images.map((image) => {
                    return (
                      <Carousel.Item key={image.public_id}>
                        <img className="d-block w-100" src={image.url} alt={product.title} />
                      </Carousel.Item>
                    );
                  })}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product #{product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{
                    width: `${product.ratings * 100}%`,
                  }}
                ></div>
              </div>
              <span id="no_of_reviews">{product.numOfReviews} Reviews</span>

              <hr />

              <p id="product_price">₹{CurrencyINR.format(product.price)}</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decrementQt}>
                  -
                </span>

                <input type="number" className="form-control count d-inline" 
                value={qt} readOnly />

                <span className="btn btn-primary plus" onClick={incrementQt}>
                  +
                </span>
              </div>
              <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" onClick={addToCart}>
                Add to Cart
              </button>

              <Link
                to={`${product.stock ? '/shipping' : '#!'}`}
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
                onClick={addToCart}
              >
                Buy
              </Link>

              <hr />

              <p>
                Status:
                <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>
              {isAuthenticated ? (
                <button
                  id="review_btn"
                  type="button"
                  className="btn btn-primary mt-4"
                  data-toggle="modal"
                  data-target="#ratingModal"
                  onClick={userRatings}
                >
                  Submit Your Review
                </button>
              ) : (
                <Link to="/login" id="review_btn" type="button" className="btn btn-primary mt-4">
                  Login to submit your review
                </Link>
              )}

              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <div
                    className="modal fade"
                    id="ratingModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="ratingModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="ratingModalLabel">
                            Submit Review
                          </h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <ul className="stars">
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                          </ul>

                          <textarea
                            name="review"
                            id="review"
                            className="form-control mt-3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></textarea>

                          <button
                            className="btn my-3 float-right review-btn px-4 text-white"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={reviewHandler}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {product.reviews && product.reviews.length > 0 && <ListReview reviews={product.reviews} />}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;

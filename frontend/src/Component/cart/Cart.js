import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartSteps from './CartSteps';
import MetaData from '../layouts/MetaData';
import CurrencyINR from '../../constants/currency';
import { addItem, removeItem } from '../../actions/cartActions';

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state=>state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const incrementQt = (item, qt) => {
    qt++;
    if (qt > item.stock) return;
    dispatch(addItem(item, qt));
  };

  const decrementQt = (item, qt) => {
    qt--;
    if (qt < 1) return;
    dispatch(addItem(item, qt));
  };

  const remove = (id) => {
    dispatch(removeItem(id));
  };

  const checkOutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Fragment>
      <MetaData title="Cart" />
      <CartSteps cart />
      {cartItems.length < 1 ? (
        <h2 className="mt-5">Your cart is empty</h2>
      ) : (
        <Fragment>
          <h2 className="mt-5">
            Your Cart: <b>{cartItems.reduce((acc, item) => item.quantity + acc, 0)} items</b>
          </h2>

          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <Fragment key={item.product}>
                  <hr />
                  <div className="cart-item">
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <img src={item.image} alt={item.name} height="90" width="115" />
                      </div>

                      <div className="col-5 col-lg-3">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p id="card_item_price">₹{CurrencyINR.format(item.price)}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <div className="stockCounter d-inline">
                          <span className="btn btn-danger minus" onClick={() => decrementQt(item, item.quantity)}>
                            -
                          </span>
                          <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

                          <span className="btn btn-primary plus" onClick={() => incrementQt(item, item.quantity)}>
                            +
                          </span>
                        </div>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                        <i
                          id="delete_cart_item"
                          className="fa fa-trash btn btn-danger"
                          onClick={() => remove(item.product)}
                        ></i>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              ))}
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:
                  <span className="order-summary-values">
                    {cartItems.reduce((acc, item) => item.quantity + acc, 0)} (Units)
                  </span>
                </p>
                <p>
                  Est. total:
                  <span className="order-summary-values">
                    ₹
                    {CurrencyINR.format(
                      cartItems.reduce((acc, item) => item.price * item.quantity + acc, 0).toFixed(2)
                    )}
                  </span>
                </p>

                <hr />
                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkOutHandler}>
                  Check out
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;

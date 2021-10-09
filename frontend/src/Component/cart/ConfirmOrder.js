import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import CartSteps from './CartSteps';
import { useSelector } from 'react-redux';
import CurrencyINR from '../../constants/currency';

const ConfirmOrder = ({ history }) => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const itemsPrice = Number(cartItems.reduce((acc, item) => item.price * item.quantity + acc, 0).toFixed(2));
  const tax = Number(cartItems.reduce((acc, item) => item.price * item.quantity * 0.18 + acc, 0).toFixed(2));
  const shippingPrice = itemsPrice >= 200 ? 0 : 25;
  //   const tax = Number((0.18 * itemsPrice).toFixed(2));
  const totalPayment = shippingPrice + tax + itemsPrice;

  const payment = () => {
    const data = {
      itemsPrice,
      shippingPrice,
      tax,
      totalPayment,
    };
    sessionStorage.setItem('orderInfo', JSON.stringify(data));
    history.push('/payment');
  };

  return (
    <Fragment>
      <MetaData title={isAuthenticated ? "Confirm Order" : 'Only the excellent products'} />
      <CartSteps cart shipping confirm />

      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Shipping Info</h4>
          <p>
            <b>Name: </b>
            {user && user.name}
          </p>
          <p>
            <b>Phone: </b>
            {shippingInfo.phone}
          </p>
          <p className="mb-4">
            <b>Address: </b>
            {`${shippingInfo.address.trim()}, ${shippingInfo.city}, ${shippingInfo.country}`}
          </p>

          <hr />

          <h4 className="mt-4">Your Cart Items:</h4>
          {cartItems.map((item) => (
            <Fragment key={item.product}>
              <hr />
              <div className="cart-item my-1">
                <div className="row">
                  <div className="col-4 col-lg-2">
                    <img src={item.image} alt={item.name} height="45" width="65" />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                    <p>
                      {item.quantity} x ₹{CurrencyINR.format(item.price)} ={' '}
                      <b>₹{CurrencyINR.format((item.quantity * item.price).toFixed(2))}</b>
                    </p>
                  </div>
                </div>
              </div>
              <hr />
            </Fragment>
          ))}
          <hr />
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Subtotal: <span className="order-summary-values">₹{CurrencyINR.format(itemsPrice)}</span>
            </p>
            <p>
              Shipping: <span className="order-summary-values">₹{CurrencyINR.format(shippingPrice)}</span>
            </p>
            <p>
              Tax: <span className="order-summary-values">₹{CurrencyINR.format(tax)}</span>
            </p>

            <hr />

            <p>
              Total: <span className="order-summary-values">₹{CurrencyINR.format(totalPayment)}</span>
            </p>

            <hr />
            <button id="checkout_btn" className="btn btn-primary btn-block" onClick={() => payment()}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;

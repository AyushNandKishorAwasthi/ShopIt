import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const CartSteps = ({ cart, shipping, confirm, payment }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      {cart ? (
        <Link to="/cart" className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Cart</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Cart</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {shipping ? (
        <Link to="/shipping" className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Checkout</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to={!isAuthenticated ? '/login?redirect=shipping' : cartItems.length > 0 ? '/shipping' : '#!'} disabled>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Checkout</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {confirm ? (
        <Link to="/order/confirm" className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Confirm Order</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Confirm Order</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {payment ? (
        <Link to="/payment" className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Payment</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Payment</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}
    </div>
  );
};

export default CartSteps;

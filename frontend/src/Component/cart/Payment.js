import React, { Fragment, useEffect } from 'react';
import { useAlert } from 'react-alert';
import CartSteps from './CartSteps';
import CurrencyINR from '../../constants/currency';
import { clearCart } from '../../actions/cartActions';
import { createOrder, clearErrors } from '../../actions/orderActions';
import MetaData from '../layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const Payment = ({ history }) => {
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.order);

  const options = {
    style: {
      base: {
        fontSize: '16px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.taxPrice = orderInfo.tax;
    order.shippingPrice = orderInfo.shippingPrice;
    order.totalPrice = orderInfo.totalPayment;
  }

  const paymentData = {
    amount: Math.round(orderInfo.totalPayment * 100), //to convert price in cents/paise
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector('#pay_btn').disabled = true;
    let res;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      res = await axios.post('/api/v1/payment/process', paymentData, config);

      const client_secret = res.data.client_Secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });
      if (result.error) throw result.error;
      //   alert.error(result.error.message);
      //   document.querySelector('#pay_btn').disabled = false;
      // }
      if (result.paymentIntent.status === 'succeeded') {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };
        dispatch(createOrder(order));
        dispatch(clearCart());
        history.push('/success');
      } else alert.error('There was an error occurred while processing payment.');
    } catch (err) {
      document.querySelector('#pay_btn').disabled = false;
      alert.error(err.message);
    }
  };

  return (
    <Fragment>
      <MetaData title={isAuthenticated ? "Payment" : 'Only the excellent products'} />
      <CartSteps cart shipping confirm payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement type="text" id="card_num_field" className="form-control" options={options} />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement type="text" id="card_exp_field" className="form-control" options={options} />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement type="text" id="card_cvc_field" className="form-control" options={options} />
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-3">
              Pay {`₹${CurrencyINR.format(orderInfo.totalPayment)}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;

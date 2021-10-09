import React, { Fragment} from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import CurrencyINR from '../../constants/currency';

import Loader from '../layouts/Loader';

const OrderDetails = ({ match }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, orders } = useSelector((state) => state.myOrders);
  const order = orders.find((order) => order._id === match.params.id);
  const { shippingInfo, orderItems, paymentInfo, totalPrice, orderStatus } = order;
  
  return (
    <Fragment>
      <MetaData title={isAuthenticated ? user.name.split(' ')[0]:'Only the excellent products'} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div class="row d-flex justify-content-between">
            <div class="col-12 col-lg-8 mt-5 order-details">
              <h1 class="my-5">Order # {order._id}</h1>
              <h4 class="my-4">Order Items:</h4>
              {orderItems.map((item) => (
                <Fragment>
                  <hr />
                  <div class="cart-item my-1">
                    <div class="row my-5">
                      <div class="col-4 col-lg-2">
                        <img src={item.image} alt={item.name} height="45" width="65" />
                      </div>

                      <div class="col-5 col-lg-5">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>

                      <div class="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p>₹{CurrencyINR.format(item.price)}</p>
                      </div>

                      <div class="col-4 col-lg-3 mt-4 mt-lg-0">
                        <p>{item.quantity > 2 ? `${item.quantity} pieces` : `${item.quantity} piece`}</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              ))}
              <h4 class="mb-4">Shipping Info</h4>
              <p>
                <b>Name: </b>
                {user.name}
              </p>
              <p>
                <b>Phone: </b>
                {shippingInfo.phone}
              </p>
              <p class="mb-4">
                <b>Address:</b>
                {` ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postCode}, ${shippingInfo.country}`}
              </p>
              <p>
                <b>Amount:</b> ₹{CurrencyINR.format(totalPrice)}
              </p>

              <hr />

              <h4 class="my-4">Payment</h4>
              <p class={paymentInfo.status !== 'succeeded' ? 'redColor' : 'greenColor'}>
                <b> {paymentInfo.status !== 'succeeded' ? 'Unpaid' : 'Paid'}</b>
              </p>

              <h4 class="my-4">Order Status:</h4>
              <p class={orderStatus !== 'Delivered' ? 'redColor' : 'greenColor'}>
                <b>{orderStatus}</b>
              </p>

              <hr />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  ); 
};

export default OrderDetails;

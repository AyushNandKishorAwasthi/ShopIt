import React, {useEffect, Fragment} from 'react';
import MetaData from '../layouts/MetaData';
import CurrencyINR from '../../constants/currency';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import Loader from '../layouts/Loader';
import SideBar from './SideBar';
import { getOrderDetails, clearErrors } from '../../actions/orderActions';
import {useDispatch, useSelector} from 'react-redux'; 
const OrderAdminDetails = ({match}) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state=>state.auth);
    const {loading,order,error } = useSelector(state=>state.getOrder)
    useEffect(()=>{
        dispatch(getOrderDetails(match.params.id))
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
    },[dispatch,match,error,alert]);
    return <Fragment>
    <MetaData title={isAuthenticated ? "Order Details" : 'Only the excellent products'}/>
    <div className="row">
      <div className="col-12 col-md-2">
        <SideBar />
      </div>

      <div className="col-12 col-md-10">
        <Fragment>
          <h1>Order Details</h1>
          {loading ?(
            <Loader />
          ) : order && (
            <div className="row d-flex justify-content-between">
                    <div className="col-12 col-lg-8 mt-5 order-details">

                        <h1 className="my-5">Order # {match.params.id}</h1>

                        <h4 className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {order.user.name}</p>
                        <p><b>Phone:</b> {order.shippingInfo.phone}</p>
                        <p className="mb-4"><b>Address:</b> {order.shippingInfo.address}</p>
                        <p><b>Amount:</b> ₹{CurrencyINR.format(order.totalPrice)}</p>

                        <hr />

                        <h4 className="my-4">Payment</h4>
                        <p className={`${order.paymentInfo.status!=='succeeded'?'redColor':'greenColor'}`}><b>{order.paymentInfo.status!=='succeeded'?'UNPAID':'PAID'}</b></p>


                        <h4 className="my-4">Order Status:</h4>
                        <p className={`${order.orderStatus!=='Delivered'?'redColor':'greenColor'}`}><b> {order.orderStatus!=='Delivered'?'Processing':'Delivered'}</b></p>


                        <h4 className="my-4">Order Items:</h4>
                        {order.orderItems.map(item=>(
                            <Fragment>
                        <hr />
                        <div className="cart-item my-1">
                                    <div className="row my-5">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p> ₹{CurrencyINR.format(item.price)}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity<2?` ${item.quantity} Piece` :` ${item.quantity} Pieces` }</p>
                                        </div>
                                    </div>
                        </div>
                        <hr />
                            </Fragment>
                        ))}
                    </div>
                </div>
          )}
        </Fragment>
      </div>
    </div>
  </Fragment>
}

export default OrderAdminDetails

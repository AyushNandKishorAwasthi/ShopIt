import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import CurrencyINR from '../../constants/currency';
import { useAlert } from 'react-alert';
import { getAllOrders, clearErrors } from '../../actions/orderActions';
import { getProducts } from '../../actions/productActions'; 
import { getAllUsers } from '../../actions/authActions';
import { useSelector, useDispatch } from 'react-redux';
import SideBar from './SideBar';
const Dashboard = () => {
  const dispatch = useDispatch()
  const alert = useAlert()
  const {isAuthenticated} = useSelector(state=>state.auth);
  const { error:productError, products } = useSelector((state) => state.products);
  const {loading, orders,totalAmount, error:orderError } = useSelector((state)=>state.adminAllOrders);
  const {users, error:userError} = useSelector(state => state.adminAllUsers);


  useEffect(() => {
    dispatch(getAllOrders());       
      if(orderError){
        alert.error(orderError);
        dispatch(clearErrors());
      }
    dispatch(getProducts(false, true));
      if(productError){
        alert.error(productError);
        dispatch(clearErrors());
      }
    dispatch(getAllUsers());
      if(userError){
          alert.error(userError)
          dispatch(clearErrors());
      }
  }, [dispatch,productError,orderError,userError,alert])
  
  return (
    <Fragment>
      <MetaData title={isAuthenticated ? 'Dashboard':'Only the excellent products'} />
      {loading?
      <Loader />:
      <Fragment>
        <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>
        <div className="col-12 col-md-10">
          <h1 className="my-4">Dashboard</h1>
          <div className="row pr-4">
            <div className="col-xl-12 col-sm-12 mb-3">
              <div className="card text-white bg-primary o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Total Amount
                    <br /> <b>₹{CurrencyINR.format(totalAmount)}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row pr-4">
            <div className="col-xl-3 col-sm-6 mb-3">
              <div className="card text-white bg-success o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Products
                    <br /> <b>{products.length}</b>
                  </div>
                </div>
                <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                  <span className="float-left">View Details</span>
                  <span className="float-right">
                    <i className="fa fa-angle-right"></i>
                  </span>
                </Link>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-3">
              <div className="card text-white bg-danger o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Orders
                    <br /> <b>{orders && orders.length}</b>
                  </div>
                </div>
                <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                  <span className="float-left">View Details</span>
                  <span className="float-right">
                    <i className="fa fa-angle-right"></i>
                  </span>
                </Link>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-3">
              <div className="card text-white bg-info o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Users
                    <br /> <b>{users && users.length}</b>
                  </div>
                </div>
                <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                  <span className="float-left">View Details</span>
                  <span className="float-right">
                    <i className="fa fa-angle-right"></i>
                  </span>
                </Link>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-3">
              <div className="card text-white bg-warning o-hidden h-100">
                <div className="card-body">
                  <div className="text-center card-font-size">
                    Out of Stock
                    <br /> <b>{products.filter(product=>product.stock<1).length}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Fragment>  
    }</Fragment>
  );
};

export default Dashboard;

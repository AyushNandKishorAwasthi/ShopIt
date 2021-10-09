import React, {useEffect, Fragment} from 'react';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layouts/MetaData';
import CurrencyINR from '../../constants/currency';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import Loader from '../layouts/Loader';
import SideBar from './SideBar';
import { ORDER_DELETE_RESET } from '../../constants/orderConstants'
import { getAllOrders,deleteOrder, clearErrors } from '../../actions/orderActions';
import {useDispatch, useSelector} from 'react-redux';
const ListOrders = ({history}) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state =>state.auth);
    const {loading, orders, error } = useSelector((state)=>state.adminAllOrders);
    const {success,message} = useSelector(state=>state.deleteOrder);
      
    useEffect(()=>{
      dispatch(getAllOrders());       
      if(error){
        alert.error(error);
        dispatch(clearErrors());
      }
      if(success){
        alert.success(message);
        dispatch({type:ORDER_DELETE_RESET});
        history.push('/admin/orders')
      }
        
    },[dispatch,error, alert,history,success,message]);

    const setOrders = () => {
        const data = {
          columns: [
            {
              label: 'OrderID',
              field: 'id',
              sort: 'asc',
            },
            {
              label: 'Number of Items',
              field: 'numOfItems', // rows and columns are connected using this
              sort: 'asc',
            },
            {
              label: 'Status',
              field: 'status',
              sort: 'asc',
            },
            {
              label: 'Amount',
              field: 'amount',
              sort: 'asc',
            },
            {
              label: 'Actions',
              field: 'actions',
              sort: 'asc',
            },
          ],
          rows: [],
        };
        orders && orders.forEach((order) => {
          data.rows.push({
            id:(
              <Fragment>
                <Link to={`/admin/orders/details/${order._id}`} className="py-1 px-2">
                {order._id}    
                </Link>
              </Fragment>
            ),
            numOfItems:order.orderItems.length,
            amount: `₹${CurrencyINR.format(order.totalPrice)}`,
            status: <p style={{ color: order.orderStatus !== 'Delivered' ? 'red' : 'green' }}>{order.orderStatus}</p>,
            actions: (
              <Fragment>
                <Link to={`/admin/orders/update/${order._id}`} 
                data-toggle="tooltip" data-placement="left" title="Update"
                className="btn btn-primary py-1 px-2">
                  <i className="fa fa-pencil"></i>
                </Link>
    
                <button className="btn btn-danger py-1 px-2 ml-2" 
                data-toggle="tooltip" data-placement="left" title="Delete"
                onClick={() => orderDelete(order._id)}>
                  <i className="fa fa-trash"></i>
                </button>
              </Fragment>
            ),
          });
        });
        return data;
      };
      const orderDelete = (order) => {
        dispatch(deleteOrder(order));
      }
    return <Fragment>
              <MetaData title={isAuthenticated ? 'All Orders':'Only the excellent products'} />
              <div className="row">
                <div className="col-12 col-md-2">
                  <SideBar />
                </div>
        
                <div className="col-12 col-md-10">
                  <Fragment>
                    <h1>All Orders</h1>
                    {loading ?(
                      <Loader />
                    ) : (
                      <MDBDataTable
                        data={setOrders()}
                        className="px-3"
                        bordered
                        striped
                        hover
                        entries={5}
                        entriesOptions={[5, 10, 15]}
                      />
                    )}
                  </Fragment>
                </div>
              </div>
            </Fragment>
}
export default ListOrders
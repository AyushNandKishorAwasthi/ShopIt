import React, { Fragment, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import CurrencyINR from '../../constants/currency';
import { clearErrors, myOrders } from '../../actions/orderActions';
import Loader from '../layouts/Loader';

const ListOrder = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  useEffect(() => {
    dispatch(myOrders());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: 'OrderId',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Number Of Items',
          field: 'numOfItems', // rows and columns are connected using this
          sort: 'asc',
        },
        {
          label: 'Amount',
          field: 'amount',
          sort: 'asc',
        },
        {
          label: 'Status',
          field: 'status',
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
    orders.forEach((order) => {
      data.rows.push({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `₹${CurrencyINR.format(order.totalPrice)}`,
        status: <p style={{ color: order.orderStatus !== 'Delivered' ? 'red' : 'green' }}>{order.orderStatus}</p>,
        actions: (
          <Link to={`/orders/me/${order._id}`} className="btn btn-primary">
            <i className="fa fa-eye"></i>
          </Link>
        ),
      });
    });
    return data;
  };

  return (
    <Fragment>
      <MetaData title={ isAuthenticated ?user.name.split(' ')[0]:'Only the excellent products'} />
      <h1 className="my-5">My Orders</h1>
      {loading ? (
        <Loader />
      ) : orders.length>0?
      (
        <MDBDataTable
          data={setOrders()}
          className="px-3"
          bordered
          striped
          hover
          entries={5}
          entriesOptions={[5, 10, 15]}
        />
      ):"You have no orders"
    }
    </Fragment>
  );
};

export default ListOrder;

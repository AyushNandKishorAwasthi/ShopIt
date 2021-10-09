import React, { Fragment, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import CurrencyINR from '../../constants/currency';
import { clearErrors, getProducts, deleteProduct } from '../../actions/productActions';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import Loader from '../layouts/Loader';
import SideBar from './SideBar';

const ListProducts = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state=>state.auth);
  const { loading, error, products } = useSelector((state) => state.products);
  const { error: isError, success, message } = useSelector((state) => state.deleteProduct);

  useEffect(() => {
    dispatch(getProducts(false, true));
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isError) {
      alert.error(isError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success(message);
      history.push('/admin/products');
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, isError, success, message, history]);

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: 'ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name', // rows and columns are connected using this
          sort: 'asc',
        },
        {
          label: 'Price',
          field: 'price',
          sort: 'asc',
        },
        {
          label: 'Stock',
          field: 'stock',
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
    products && products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: (
          <Fragment>
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </Fragment>
        ),
        price: `₹${CurrencyINR.format(product.price)}`,
        stock: <p style={{ color: product.stock <= 10 ? 'red' : 'green' }}>{product.stock}</p>,
        actions: (
          <Fragment>
            <Link to={`/admin/product/${product._id}`} 
            data-toggle="tooltip" data-placement="left" title="Update"
            className="btn btn-primary py-1 px-2">
              <i className="fa fa-pencil"></i>
            </Link>

            <button className="btn btn-danger py-1 px-2 ml-2" 
            data-toggle="tooltip" data-placement="left" title="Delete"
            onClick={() => productDelete(product._id)}>
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });
    return data;
  };
  const productDelete = (product) => {
    dispatch(deleteProduct(product));
  };

  return (
    <Fragment>
      <MetaData title={isAuthenticated ? 'All Products':'Only the excellent products'} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1>All Products</h1>
            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setProducts()}
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
  );
};

export default ListProducts;

import React, {useEffect, Fragment} from 'react';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import Loader from '../layouts/Loader';
import SideBar from './SideBar';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import {useDispatch, useSelector} from 'react-redux';
import { getAllReview, deleteReview, clearErrors } from '../../actions/productActions';
const ListReviews = ({history}) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state=>state.auth);
    const { loading, reviews, error} = useSelector(state=>state.getAllReview) 
    const { deleting, message, deleteError } = useSelector(state=>state.deleteReview);
    useEffect(() => {
        dispatch(getAllReview())
        if(error){
          alert.error(error)
          dispatch(clearErrors())
        }
        if(deleteError){
          alert.error(deleteError)
          dispatch(clearErrors())
        }
        if(message){
          alert.success(message);
          dispatch({type:DELETE_REVIEW_RESET});
          history.push('/admin/reviews');
        }
    }, [dispatch,alert,error,deleteError,message,history])
  
    const setReviews = () => {
        const data = {
          columns: [
            {
              label: 'Product ID',
              field: 'pId',// rows and columns are connected using this
              sort: 'asc',
            },
            {
              label: 'Username',
              field: 'uName',
              sort: 'asc',
            },
            {
              label: 'Comment',
              field: 'comment',
              sort: 'asc',
            },
            {
              label: 'Rating',
              field: 'rating',
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
        reviews && reviews.forEach((review) => {
          data.rows.push({
            pId:(
              <Fragment>
                <Link to={`/product/${review.product}`}>
                {review.product}
              </Link>
            </Fragment>),
            uName: review.user.name,
            comment:review.comment,
            rating:review.rating,
            actions: (
                <Fragment>
                  <button className="btn btn-danger py-1 px-2 ml-2"
                   data-toggle="tooltip" data-placement="top" title="Delete"
                   onClick={() => reviewDelete(review._id,review.product)} >
                  <i className="fa fa-trash"></i>
                </button>
              </Fragment>)
            })
          });
        return data;
    };
      const reviewDelete = (rId,pId) => {
        dispatch(deleteReview(rId,pId));
      };
    
      return (
        <Fragment>
          <MetaData title={isAuthenticated ? "All Reviews" : 'Only the excellent products'} />
          <div className="row">
            <div className="col-12 col-md-2">
              <SideBar />
            </div>
    
            <div className="col-12 col-md-10">
              <Fragment>
                <h1>All Products Reviews</h1>
                {loading||deleting ? (
                  <Loader />
                ) : (
                  <MDBDataTable
                    data={setReviews()}
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
}

export default ListReviews

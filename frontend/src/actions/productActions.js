import axios from 'axios';
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  GET_REVIEW_REQUEST,
  GET_REVIEW_FAIL,
  GET_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  CLEAR_ERRORS,
} from '../constants/productConstants';

export const getProducts =
  (user = { keyword: '', currentPage: 1, price: [], category: '', rating: 0 }, admin = false) =>
  async (dispatch) => {
    try {
      let link;
      if (user) {
        let key = user.keyword !== undefined ? user.keyword : '';
        link = `/api/v1/products?keyword=${key}&page=${user.currentPage}&price[lte]=${user.price[1]}&price[gte]=${user.price[0]}&ratings[gte]=${user.rating}`;
        if (user.category !== '' && user.category !== 'Reset All Categories')
          link = `/api/v1/products?keyword=${key}&page=${user.currentPage}&price[lte]=${user.price[1]}&price[gte]=${user.price[0]}&category=${user.category}&ratings[gte]=${user.rating}`;
      }
      dispatch({ type: ALL_PRODUCTS_REQUEST });
      if (admin) link = '/api/v1/admin/products';
      const { data } = await axios.get(link);
      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (err) {
     
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: err.response.data.message,
      });
    }
  };

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/v1/product/${id}`);
   
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const newReview = (id, review) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.put(`/api/v1/review/${id}`, review, config);

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const addNewProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(`/api/v1/admin/product/new`, product, config);
    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (err) {
    
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const updateProduct = (productData, productId) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.put(`/api/v1/admin/product/${productId}`, productData, config);
    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (err) {
    
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const deleteProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    const { data } = await axios.delete(`/api/v1/admin/product/${product}`);
    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const getAllReview = () => async dispatch=>{
  try {
    dispatch({
      type:GET_REVIEW_REQUEST
    })
    const {data} = await axios.get(`/api/v1/admin/review/all/product`);
    dispatch({
      type:GET_REVIEW_SUCCESS,
      payload:data
    })
  } catch (err) {
    dispatch({
      type:GET_REVIEW_FAIL,
      payload:err.response.data.message,
    })
  }
}

export const deleteReview = (rId, pId) => async dispatch=> {
  try {
    dispatch({
      type:DELETE_REVIEW_REQUEST
    })
    const { data } = await axios.delete(`/api/v1/product/${pId}/review?id=${rId}`);
    dispatch({
      type:DELETE_REVIEW_SUCCESS,
      payload:data,
    })
  } catch (err) {
    dispatch({
      type:DELETE_REVIEW_FAIL,
      payload:err.response.data.message,
    })
  }
}


export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

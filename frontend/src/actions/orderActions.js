import {
  CREATE_ORDER_FAIL,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,

  MY_ORDER_FAIL,
  MY_ORDER_REQUEST,
  MY_ORDER_SUCCESS,

  ORDER_DELETE_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,

  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,

  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDER_UPDATE_RESET,

  CLEAR_ERRORS,

  ALL_ORDER_FAIL,
  ALL_ORDER_REQUEST,
  ALL_ORDER_SUCCESS,
} from '../constants/orderConstants';
import axios from 'axios';

export const createOrder = (orderData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });
    const config = {
        headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post('/api/v1/order/new', orderData, config);
    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data.order,
    });
  } catch (err) {
    dispatch({ type: CREATE_ORDER_FAIL, payload: err.response.data.message });
  }
};

export const myOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: MY_ORDER_REQUEST,
    });
    const { data } = await axios.get('/api/v1/orders/me');
    dispatch({
      type: MY_ORDER_SUCCESS,
      payload: data.order,
    });
  } catch (err) {
    dispatch({
      type: MY_ORDER_FAIL,
      payload: err.response.data.message,
    });
  }
};
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: ALL_ORDER_REQUEST,
    });
    const { data } = await axios.get('/api/v1/admin/orders');
    dispatch({
      type: ALL_ORDER_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ALL_ORDER_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const getOrderDetails = (orderId) => async dispatch=>{
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });
    const { data } = await axios.get(`/api/v1/order/${orderId}`);
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: err.response.data.message,
    });
  }
}

export const updateOrder = (orderId,formData) =>async dispatch => {
  try{
    dispatch({type:ORDER_UPDATE_REQUEST})
    const config = {
      headers:{
        'Content-Type':'application/json'
      }
    }
    const {data} = await axios.put(`/api/v1/admin/order/${orderId}`,formData,config);
    dispatch({
      type:ORDER_UPDATE_SUCCESS,
      payload:data
    })
  }catch(err){
    dispatch({
      type:ORDER_UPDATE_FAIL,
      payload:err.response.data.message
    })
  }
}



export const deleteOrder=(orderId)=>async dispatch=>{
  try{
  dispatch({type:ORDER_DELETE_REQUEST})
  const {data} = await axios.delete(`/api/v1/admin/order/${orderId}`);
  dispatch({
    type:ORDER_DELETE_SUCCESS,
    payload:data
  })

  }catch(err){
    dispatch({
      type:ORDER_DELETE_FAIL,
      payload:err.response.data.message
    })
  }
}

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

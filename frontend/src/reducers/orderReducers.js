import {
  CREATE_ORDER_FAIL,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  
  ALL_ORDER_REQUEST,
  ALL_ORDER_SUCCESS,
  ALL_ORDER_FAIL,
  
  ORDER_DELETE_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_RESET,
  
  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDER_UPDATE_RESET,
  
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,

  MY_ORDER_FAIL,
  MY_ORDER_REQUEST,
  MY_ORDER_SUCCESS,
  
  CLEAR_ERRORS,
} from '../constants/orderConstants';
export const newOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        order: action.payload,
      };
    case CREATE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const allOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        orders:[]
      };
    case ALL_ORDER_SUCCESS:
      return {
        loading:false,
        orders: action.payload.orders,
        totalAmount: action.payload.totalAmount,
      };
    case ALL_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case MY_ORDER_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case MY_ORDER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const getOrderDetails = (state={},action) =>{
  switch(action.type){
    case ORDER_DETAILS_REQUEST:
    return{ 
      loading:true
    }
    case ORDER_DETAILS_SUCCESS:
    return{ 
      loading:false,
      order:action.payload.order,
      success:action.payload.success,
    }
    case ORDER_DETAILS_FAIL:
    return{ 
      ...state,
      erorr:action.payload.error
    }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const updateOrderReducer = (state={},action) =>{
  switch(action.type){
    case ORDER_UPDATE_REQUEST: 
    return{
      updating:true
    }
    case ORDER_UPDATE_SUCCESS: 
    return{
      updating:false,
      message:action.payload.message,
      success:action.payload.success,
    }
    case ORDER_UPDATE_FAIL: 
    return{
      ...state,
      updateError:action.payload
    }
    case ORDER_UPDATE_RESET: 
    return{
      updating:false
    }
    case CLEAR_ERRORS:
      return {
        ...state,
        updateError: null,
      };
    default:
      return state
  }
}


export const deleteOrderReducer=(state={},action)=>{
  switch(action.type){
    case ORDER_DELETE_REQUEST:
      return {
        ...state,
      }
    case ORDER_DELETE_SUCCESS:
      return{
        message:action.payload.message,
        success:action.payload.success
      }
    case ORDER_DELETE_FAIL:
      return{
        ...state,
        error:action.payload
      }
    case ORDER_DELETE_RESET:
      return{
        ...state,
        success:false
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

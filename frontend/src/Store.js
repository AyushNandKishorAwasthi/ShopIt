import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';
import { 
  newOrderReducer, 
  myOrdersReducer, 
  allOrderReducer, 
  getOrderDetails,
  deleteOrderReducer, 
  updateOrderReducer } from './reducers/orderReducers';
import {
  productReducers,
  productDetailsReducer,
  newReviewReducer,
  newProductReducers,
  deleteProductReducers,
  getReview,
  deleteReviewReducer
} from './reducers/productReducers';
import { authReducers, userReducer, forgotPasswordReducer, allUsersReducer, deleteProfileReducer } from './reducers/authReducers';
// import { LOGOUT_SUCCESS } from './constants/authConstants.js';
import { LOGIN_SUCCESS } from './constants/authConstants';
import { ALL_PRODUCTS_SUCCESS } from './constants/productConstants';
import { PRODUCT_DETAILS_SUCCESS } from './constants/productConstants';
import { LOAD_USER_SUCCESS } from './constants/authConstants';

const composeEnhancers = composeWithDevTools({ 
  actionSanitizer:(action)=>{
    if(action.type === LOGIN_SUCCESS && action.payload)
    return { ...action, payload: '<<LOGIN SUCCESSFULL>>' }
    if(action.type === LOAD_USER_SUCCESS && action.payload)
    return { ...action, payload: '<<LOAD USER SUCCESSFULL>>' }
    if(action.type === ALL_PRODUCTS_SUCCESS && action.payload)
    return { ...action, payload: '<<ALL PRODUCTS SUCCESSFULL>>' }
    if(action.type === PRODUCT_DETAILS_SUCCESS && action.payload)
    return { ...action, payload: '<<PRODUCTS DETAILS SUCCESSFULL>>' }
    return action
  },
  stateSanitizer:(state)=>{
    if(state.auth || state.products || state.productDetails || state.user)
    return { ...state, 
      auth: undefined, 
      products: undefined,
      productDetails: undefined,
      user: undefined,
      }
    return state
  },
    trace:false,// if true, will include stack trace for every ispatched action
    features: {
      pause: true, // start/pause recording of dispatched actions
      lock: true, // lock/unlock dispatching actions and side effects    
      persist: false, // persist states on page reloading
      export: true, // export history of actions in a file
      import: 'custom', // import history of actions from a file
      jump: false, // jump back and forth (time travelling)
      skip: true, // skip (cancel) actions
      reorder: false, // drag and drop actions in the history list 
      dispatch: false, // dispatch custom actions or action creators
      test: true // generate tests for the selected actions
    },
    // other options like actionSanitizer, stateSanitizer
  });

const reducer = combineReducers({
  auth: authReducers,
  user: userReducer,
  products: productReducers,
  productDetails: productDetailsReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  order: newOrderReducer,
  myOrders: myOrdersReducer,
  adminAllOrders: allOrderReducer,
  adminAllUsers:allUsersReducer,
  deleteProfile:deleteProfileReducer,
  getAllReview:getReview,
  deleteReview:deleteReviewReducer,
  getOrder:getOrderDetails,
  updateOrder:updateOrderReducer,
  deleteOrder:deleteOrderReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducers,
  deleteProduct: deleteProductReducers,
});

// const rootReducer = (state, action) => {
//   if (action.type === LOGOUT_SUCCESS) {
//     return reducer({}, action);
//   }
//   return reducer(state, action);
// };

let initialState = {
  cart: {
    cartItems: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
    shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {},
  },
  auth:{},
  user:{}
};
const middleWare = [thunk];
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...middleWare)));
export default store;

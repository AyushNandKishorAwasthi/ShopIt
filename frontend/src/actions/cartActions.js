import { ADD_TO_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO, CLEAR_CART } from '../constants/cartConstants';
export const addItem = (product, quantity) => async (dispatch, getState) => {
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: product?._id || product.product,
      name: product.name,
      price: product.price,
      image: product.images ? product.images[0].url : product.image,
      stock: product.stock,
      quantity,
    },
  });
  localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems));
};
export const removeItem = (id) => (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: id,
  });
  localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems));
};

export const shipping = (info) => (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: info,
  });
  localStorage.setItem('shippingInfo', JSON.stringify(info));
};

export const clearCart = () => (dispatch) => {
  dispatch({
    type: CLEAR_CART,
  });
  localStorage.removeItem('cart');
};

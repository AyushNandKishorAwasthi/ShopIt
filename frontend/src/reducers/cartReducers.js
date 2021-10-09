import { ADD_TO_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO, CLEAR_CART } from '../constants/cartConstants';
export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const sameItem = state.cartItems.find((item) => item.product === action.payload.product);
      
      if (sameItem)
        return {
          ...state,
          cartItems: state.cartItems.map((item) => (item.product === sameItem.product ? action.payload : item)),
        };
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.product !== action.payload),
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };
    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};

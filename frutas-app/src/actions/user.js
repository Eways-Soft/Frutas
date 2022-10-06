import { ADD_BASKET, DELETE_BASKET,UPDATE_BASKET,SAVE_SUBSCRIPTION,SHIPPING_ADDRESS,EMPTY_CART,USER_DATA } from './types';
export const saveUserData = (data) => (
  {
    type: USER_DATA,
    data: data
  }
);
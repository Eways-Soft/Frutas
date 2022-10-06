
import NetInfo from "@react-native-community/netinfo";

import { ADD_BASKET, DELETE_BASKET,UPDATE_BASKET,SAVE_SUBSCRIPTION,SHIPPING_ADDRESS,EMPTY_CART,USER_ID } from './types';
import Constants from '../config/Constants';
var BASE_URL = Constants.BASE_URL;

export const userID = (data) => (
  {
    type: USER_ID,
    data: data
  }
);

export const addBasket = (data) => (
  {
    type: ADD_BASKET,
    key: data.basket_id,
    data: data
  }
);

export const removeBasket = (data) => (
  {
    type: DELETE_BASKET,
    key: data.basket_id,
    data: data
  }
);

export const updateBasket = (data) => (
  {
    type: UPDATE_BASKET,
    key: data.basket_id,
    data: data
  }
);

export const saveSubscriptions = (data) => (
  {
    type: SAVE_SUBSCRIPTION,
    data: data
  }
);

export const saveShippingAddress = (data) => (
  {
    type: SHIPPING_ADDRESS,
    data: data
  }
);

export const emptyCart = () => (
  {
    type: EMPTY_CART
  }
);

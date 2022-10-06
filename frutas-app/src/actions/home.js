
import NetInfo from "@react-native-community/netinfo";

import { RECOMENDED_BASKET,BESTSELLER_BASKET,SINGLEBOX_BASKET,DISCOUNT_BASKETS,MAIN_CATEGORIES } from './types';
import Constants from '../config/Constants';
var BASE_URL = Constants.BASE_URL;

export const saveRecomendedBasketsForHome = (data) => (
  {
    type: RECOMENDED_BASKET,
    key: '',
    data: data
  }
);

export const saveBestSellerBasketsForHome = (data) => (
  {
    type: BESTSELLER_BASKET,
    key: '',
    data: data
  }
);

export const saveDicountBasketsForHome = (data) => (
  {
    type: DISCOUNT_BASKETS,
    key: '',
    data: data
  }
);

export const saveSingleBoxBasketsForHome = (data) => (
  {
    type: SINGLEBOX_BASKET,
    key: '',
    data: data
  }
);
    

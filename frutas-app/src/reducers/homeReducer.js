import { RECOMENDED_BASKET,BESTSELLER_BASKET,SINGLEBOX_BASKET,DISCOUNT_BASKETS,MAIN_CATEGORIES } from '../actions/types';

const initialState = {
  Maincategories: [],
  RecomendedBasketList: [],
  BestSellerBasketList: [],
  SingleBoxesBasketList: [],
  DiscountBasketList: [],
  isLoading: false,
}     

const homeReducer = (state = initialState, action) => {   

  switch (action.type) { 
    case 'RECOMENDED_BASKET':
      return {
        ...state,
        RecomendedBasketList: action.data,
      };
    case 'BESTSELLER_BASKET':
      return {
        ...state,
        BestSellerBasketList: action.data,
      };  
    
    case 'SINGLEBOX_BASKET':
      return {
        ...state,
        SingleBoxesBasketList: action.data,
      };  
    
    case 'DISCOUNT_BASKETS':
      return {
        ...state,
        SingleBoxesBasketList: action.data,
      };    
    default:
        return state
  }
  
}

export default homeReducer;
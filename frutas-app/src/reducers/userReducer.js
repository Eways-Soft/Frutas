import { ADD_BASKET, UPDATE_BASKET, DELETE_BASKET,SAVE_SUBSCRIPTION,SHIPPING_ADDRESS,EMPTY_CART,USER_ID,USER_DATA } from '../actions/types';
 
const initialState = {
  UserID:'',
  UserData:[],
}          

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_DATA:    
      //console.log('userReducer :',action.data.customer_id)  
      return {
        ...state,
        UserData: action.data,
        UserID: action.data.customer_id,
      };
    default:
      return state;
  }
  
} 

export default userReducer;
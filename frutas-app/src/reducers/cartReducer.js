import { ADD_BASKET, UPDATE_BASKET, DELETE_BASKET,SAVE_SUBSCRIPTION,SHIPPING_ADDRESS,EMPTY_CART,USER_ID } from '../actions/types';
 
const initialState = {
  SubscriptionList: [],
  CartBasketList: [],
  SubTotal:0,
  DeliveryFee:0,
  TotalAmount:0,
  TotalItems:0,
  Notifications:0,
  ShippingAddress:'',
  DeliveryName:'',
  DeliveryMobile:'',
  DeliveryCity:'',
  DeliveryPincode:'',
  UserID:0,
}          

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BASKET:
      let addedItem = ''
      var currentItems = state.CartBasketList;
      if(currentItems !== ''){
        var length = state.CartBasketList.length;
      }else{
        var length = 0;
      }  

      let existed_item = state.CartBasketList.find(item=> action.data.basket_id === item.basket_id);

      if(existed_item){   
        var items = state.CartBasketList.filter(function (i) { return i.basket_id !== action.data.basket_id; });

        var finalItems = items.concat(action.data)

        return {
          ...state,
          CartBasketList: finalItems,
          TotalItems:finalItems.length,
          DeliveryFee:0,
          SubTotal:calculateCartSubTotal(finalItems),
          TotalAmount:calculateCartTotal(finalItems)
        };
        
      }else{
        var finalItems = state.CartBasketList.concat(action.data)
      
        return {
          ...state,
          CartBasketList: finalItems,
          TotalItems:finalItems.length,
          DeliveryFee:0,
          SubTotal:calculateCartSubTotal(finalItems),
          TotalAmount:calculateCartTotal(finalItems)
        }; 
      }
       
    case UPDATE_BASKET:
      var list = state.CartBasketList
      var finalItems = updateObjectInArray(list,action)
      return {
        ...state,
        CartBasketList: finalItems,
        TotalItems:finalItems.length,
        DeliveryFee:0,
        SubTotal:calculateCartSubTotal(finalItems),
        TotalAmount:calculateCartTotal(finalItems)
      };

    case DELETE_BASKET:

      var items = state.CartBasketList.filter(function (i) { return i.basket_id !== action.data.basket_id; });
      
      var finalItems = items 

      return {
        ...state,
        CartBasketList: finalItems,
        TotalItems:finalItems.length,
        DeliveryFee:0,
        SubTotal:calculateCartSubTotal(finalItems),
        TotalAmount:calculateCartTotal(finalItems)
      };

    case SAVE_SUBSCRIPTION:
      return {
        ...state,
        SubscriptionList: action.data,
      };
    case SHIPPING_ADDRESS:
      
      return {
        ...state,
        ShippingAddress: action.data.address,
        DeliveryName: action.data.name,
        DeliveryMobile: action.data.mobile,
        DeliveryCity: action.data.city,
        DeliveryPincode: action.data.pincode,
      };
    case EMPTY_CART:
      console.log('EMPTY_CART')
      return {
        ...state,
        CartBasketList: [],
        TotalItems:0,
        DeliveryFee:0,
        SubTotal:0,
        TotalAmount:0
      }; 
    case USER_ID:      
      return {
        ...state,
        UserID: action.data,
      };
    default:
      return state;
  }
  
} 

var calculateCartSubTotal = function (items) {
    return items.reduce(function (total, item) { 
      if(item.discount_price != '0'){
        return total + item.quantity * item.actual_price; 
      }else{
        return total + item.quantity * item.actual_price; 
      }
    }, 0);
};  

var calculateCartTotal = function (items) {
  var subtotal = items.reduce(function (total, item) { 
    if(item.discount_price != '0'){
      return total + item.quantity * item.actual_price; 
    }else{
      return total + item.quantity * item.actual_price; 
    }
  }, 0);
  return initialState.DeliveryFee+subtotal
    
};

function updateObjectInArray(list, action) {
  return list.map((item, index) => {
    if (item.basket_id !== action.key) {
      return item
    }else{
      return {
        ...action.data
      }
    }
  })
}
/*
function updateQtyInArray(list, action) {
  //console.log('list :',list)
  return list.map((item, index) => {
    if (item.basket_id === action.data.basket_id) {
      var newItem = item.quantity = item.quantity+action.data.quantity
      console.log('newItem :',newItem)
      return item
    }else{
      return {
        ...action.data
      }
    }
  })
}*/

export default cartReducer;
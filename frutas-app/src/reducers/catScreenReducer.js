import { GO_CAT_SCREEN } from '../actions/types';

const initialState = {
  BasketList: [],
  CatId:1,
  CatName:'Men',
} 

const catScreenReducer = (state = initialState, action) => {
  switch (action.type) {
    case GO_CAT_SCREEN:
    //console.log('catScreenReducer :')
      return {
        ...state,
        CatId:action.key,
        CatName:action.data
      };
      
    default:
      return state;
  }

  
}

export default catScreenReducer;
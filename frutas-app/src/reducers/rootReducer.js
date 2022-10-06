import { combineReducers } from 'redux'
import catScreenReducer from './catScreenReducer'
import cartReducer from './cartReducer'
import userReducer from './userReducer'
import homeReducer from './homeReducer'

export default combineReducers ({
	homeReducer,
	catScreenReducer,
	cartReducer,
	userReducer
})

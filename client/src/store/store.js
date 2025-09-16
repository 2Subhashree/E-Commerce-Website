import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from "./productSlice"
import cartReducer from './cartProduct'
import addressReducer from "./addressSlice"

export default configureStore({
  reducer: {
    user : userReducer,
    product : productReducer,
    cartItem : cartReducer,
    addresses : addressReducer
  },
})
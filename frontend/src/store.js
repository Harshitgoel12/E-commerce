import { configureStore } from '@reduxjs/toolkit'
import singupData from "./slices/userData"
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import settingsReducer from "./slices/settingsSlice";

 const store = configureStore({
  reducer: {
    singupData,
    products: productsReducer,
    cart: cartReducer,
    settings: settingsReducer,
  },
})


export default store;

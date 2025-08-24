import { configureStore } from '@reduxjs/toolkit'
import singupData from "./slice/UserSlice"


 const store = configureStore({
  reducer: {
    singupData,
  },
})


export default store;
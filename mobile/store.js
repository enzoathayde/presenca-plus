import userReducer from "./slices/userSlice";
import attendanceReducer from './slices/attendanceSlice'
import { configureStore } from '@reduxjs/toolkit';


export const store = configureStore({
  reducer: {
      user: userReducer,
      attendance: attendanceReducer
  }
})

export default store;
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: ""
  },
  reducers: {
    setUsername: (state, action) => {
      state.name = action.payload;
    }
  }
})


export const { setUsername } = userSlice.actions;
export const selectUsername = (state) => state.user.value; 
export default userSlice.reducer; 
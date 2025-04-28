import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  id: '',
  name: '',
  email: '',
  role: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
    }
  }
})


export const { setUsername } = userSlice.actions;
export const selectUsername = (state) => state.user.value; 
export default userSlice.reducer; 
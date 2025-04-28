import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  typeAttendance: '',
  eventId: ''
}

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceType: (state,action) => {
      state.typeAttendance = action.payload;
    },
    setEventId: (state, action) => {
      state.eventId = action.payload;
    }
  }
})

export const {setAttendanceType, setEventId} = attendanceSlice.actions;
export const selectAttendance = (state) => state.attendance.value;
export default attendanceSlice.reducer;
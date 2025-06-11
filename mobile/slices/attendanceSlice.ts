import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AttendanceState {
  typeAttendance: string;
  eventId: string;
  offlineMode: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  pendingSync: number;
  isConnected: boolean;
}

const initialState: AttendanceState = {
  typeAttendance: '',
  eventId: '',
  offlineMode: false,
  syncStatus: 'idle',
  pendingSync: 0,
  isConnected: true
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceType: (state, action: PayloadAction<string>) => {
      state.typeAttendance = action.payload;
    },
    setEventId: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload;
    },
    setSyncStatus: (state, action: PayloadAction<'idle' | 'syncing' | 'success' | 'error'>) => {
      state.syncStatus = action.payload;
    },
    setPendingSync: (state, action: PayloadAction<number>) => {
      state.pendingSync = action.payload;
    },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    }
  }
});

export const { 
  setAttendanceType, 
  setEventId, 
  setOfflineMode, 
  setSyncStatus, 
  setPendingSync,
  setIsConnected
} = attendanceSlice.actions;

export const selectAttendance = (state: any) => state.attendance;
export default attendanceSlice.reducer; 
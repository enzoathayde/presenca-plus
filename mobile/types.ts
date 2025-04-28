export interface RootState {
  user: {
    id: string
    name: string;
    email: string;
    role: string; 
  };

  attendance: {
    typeAttendance: string;
    eventId: string;
  }
}
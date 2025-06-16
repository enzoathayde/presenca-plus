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
    offlineMode: boolean;
    syncStatus: 'idle' | 'syncing' | 'success' | 'error';
    pendingSync: number;
    isConnected: boolean;
  }
}
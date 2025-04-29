export interface AttendanceDTO {
  eventId: string; 
  userId: string; 
  checkInMethod: "qr" | "manual"; 
  checkInTime: Date;
  location: {
    lat: number; 
    long: number; 
  };
  deviceInfo: {
    brand: string; 
    modelName: string; 
    osName: string; 
    osVersion: string; 
  };
  synced?: boolean; 
}
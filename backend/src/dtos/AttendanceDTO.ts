export interface AttendanceDTO {
  eventId: string; 
  userId: string; 
  imageCheckIn: string; 
  qrCode: null | string;
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
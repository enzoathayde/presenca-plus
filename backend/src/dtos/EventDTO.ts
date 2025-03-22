export interface EventDTO {
  title: string;
  description?: string; 
  startDate: Date | string;
  endDate: Date | string;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  maxParticipants: number;
  createdBy: string; 
  type: "class" | "lecture" | "workshop" | "other"; 
  category: string;
  qrCodeData?: string; 
}
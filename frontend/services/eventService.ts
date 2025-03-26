import api from './api';
import axios from 'axios';

export interface CreateEventDTO {
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
export const createEvent = async (eventData: CreateEventDTO): Promise<void> => {
    try {
      const response = await api.post('api/events/createNew', eventData);
      console.log('Evento criado com sucesso:', response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Erro na requisição:', error.response?.data || error.message);
          throw new Error(error.response?.data?.message || 'Erro na requisição');
        } else if (error instanceof Error) {
          console.error('Erro desconhecido:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Erro inesperado:', error);
          throw new Error('Erro desconhecido ao criar evento');
        }
    }
};
  

export const getAllEvents = async () => {
  try {
    const response = await api.get('api/events/getAll');
    console.log('Usuário criado com sucesso:', response.data);
    return response;
  } catch (error) {
    throw new Error('Falha ao carregar eventos');
  }
};
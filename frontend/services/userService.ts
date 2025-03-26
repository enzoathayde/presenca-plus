import axios from 'axios';
import api from './api';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  course: string;
  registration: string;
  role: string;
}

export const createUser = async (userData: CreateUserDTO): Promise<void> => {
  try {
    const response = await api.post('api/users/createNew', userData);
    console.log('Usuário criado com sucesso:', response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Tratamento para erros de requisição Axios
      console.error('Erro na requisição:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro na requisição');
    } else if (error instanceof Error) {
      // Tratamento para outros erros
      console.error('Erro desconhecido:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Erro inesperado:', error);
      throw new Error('Erro desconhecido ao criar usuário');
    }
  }
};

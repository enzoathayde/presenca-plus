import { url } from "./axios.service";

export const findUsersByRole = (role: string): Promise<any> => {


  try {
    const params = new URLSearchParams();
    params.append("role", role);
    
    const response = url.get("/api/users/findByRole", { params });

    return response;
  } catch (error) {
    throw error;
  }
};

export const editUser = async (userId: string, updatedData: any): Promise<any> => {
  try {
    const response = await url.put(`/api/users/${userId}`, updatedData); // <- JSON direto
    return response;
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    throw error;
  }
};


export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const params = new URLSearchParams();
    params.append('userId', userId);

    // Enviamos os parâmetros na requisição DELETE
    const response = await url.delete(`/api/users/${userId}`, { params });

    return response;
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    throw error;
  }
};
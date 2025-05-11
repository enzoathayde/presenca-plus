import { log } from "console";
import { UserDTO } from "../dtos/UserDTO";

import { createNewUserRepository, getUserByEmailRepository, deleteUserRepository, editUserRepository, getAllUsersRepository, getUsersByRoleRepository } from "../repository/userRepository";

const getAllUsersService = async () => {
  try {
    const allUsers = await getAllUsersRepository();     

    return allUsers;
  } catch (error) {
    throw new Error("Users not found") 
  }  
}

const getUsersByRoleService = async (role: string) => {
  try {
    const users = await getUsersByRoleRepository(role);
    return users;
  } catch (error) {
    throw new Error("Erro ao buscar usuários com a role especificada");
  }
};


const getUserByEmailService = async (userEmail: string) => {
  try {
    const userFound = await getUserByEmailRepository(userEmail);

    return userFound;
  } catch (error) {
      throw error;
  }
}
const createNewUserService = async (user: UserDTO) => {
   try {
      const newUser: Object = await createNewUserRepository(user);

      return newUser;
   } catch (error: any) {
      
  
      throw error;
   }
}


const editUserService = async (userId: string, user: UserDTO) => {
  try {
    const editedUser = await editUserRepository(userId, user);

    return editedUser;
  } catch (error) {
    throw new Error("Failed to edit user")
  }
}

const deleteUserService = async (userId: string) => {
  try {
    const editedUser = await deleteUserRepository(userId);

    return editedUser;
  } catch (error) {
    throw new Error("Failed to edit user")
  }
}

export { getAllUsersService, getUserByEmailService, createNewUserService, editUserService, deleteUserService, getUsersByRoleService }
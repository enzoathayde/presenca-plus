import { UserDTO } from "../dtos/UserDTO";
import { createNewUserRepository, deleteUserRepository, editUserRepository, getAllUsersRepository } from "../repository/userRepository";

const getAllUsersService = async () => {
  try {
    const allUsers = await getAllUsersRepository();  

    return allUsers;
  } catch (error) {
    throw new Error("Users not found") 
  }  
}

const createNewUserService = async (user: UserDTO) => {
   try {
      const newUser = await createNewUserRepository(user);

      return newUser;
   } catch (error) {
      throw new Error("Failed to create a new User")
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

export { getAllUsersService, createNewUserService, editUserService, deleteUserService }
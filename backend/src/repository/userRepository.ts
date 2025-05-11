import { log } from "console";
import { UserDTO } from "../dtos/UserDTO";
import User from "../models/User"

const getAllUsersRepository = async () => {
   try {
    const allUsers = User.find()

    return allUsers;
   } catch (error) {
    throw new Error("Error to find all User in database")
   }
}

const getUsersByRoleRepository = async (role: string) => {
  try {
    const users = await User.find({ role });
    return users;
  } catch (error) {
    throw new Error("Erro ao buscar usuários por role");
  }
};


const getUserByEmailRepository = async (userEmail: string) => {

   try {
      const userFound = await User.find({email: userEmail})

      return userFound;
   } catch (error) {
      throw error;
   }

}

const createNewUserRepository = async (user: UserDTO) => {

   console.log("achar email repository");

   try {
      const newUser = await User.create(user)
      
      return newUser;
   } catch (error: any) {
      console.log("repo", error);
      throw error;
   }
}

const editUserRepository = async (userId: string, user: UserDTO) => {
   try {
      const editedUser = await User.findByIdAndUpdate(userId, user)

      return editedUser;
   } catch (error) {
      throw new Error("Failed to update data from current user")
   }
}


const deleteUserRepository = async (userId: string) => {
   try {
      const editedUser = await User.findByIdAndDelete(userId)

      return editedUser;
   } catch (error) {
      throw new Error("Failed to update data from current user")
   }
}


export { getAllUsersRepository, getUserByEmailRepository, createNewUserRepository, editUserRepository ,deleteUserRepository, getUsersByRoleRepository }
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

const createNewUserRepository = async (user: UserDTO) => {
   try {
      const newUser = User.create(user)
     

      return newUser;
   } catch (error) {
      throw new Error("Failed to create a new User")
   }
}

const editUserRepository = async (userId: string, user: UserDTO) => {
   try {
      const editedUser = User.findByIdAndUpdate(userId, user)

      return editedUser;
   } catch (error) {
      throw new Error("Failed to update data from current user")
   }
}


const deleteUserRepository = async (userId: string) => {
   try {
      const editedUser = User.findByIdAndDelete(userId)

      return editedUser;
   } catch (error) {
      throw new Error("Failed to update data from current user")
   }
}


export { getAllUsersRepository, createNewUserRepository, editUserRepository ,deleteUserRepository }
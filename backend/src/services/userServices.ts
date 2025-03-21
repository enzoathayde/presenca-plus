import { getAllUsersRepository } from "../repository/userRepository";

const getAllUsersService = async () => {
  try {
    const allUsers = await getAllUsersRepository();  
  } catch (error) {
    throw new Error("Users not found") 
  }  
}

export default getAllUsersService
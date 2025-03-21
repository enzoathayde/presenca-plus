import User from "../models/User"


export const getAllUsersRepository = async () => {
   try {
    const allUsers = User.find()
    return allUsers;
   } catch (error) {
    throw new Error("Error to find all User in database")
   }
}


export default getAllUsersRepository
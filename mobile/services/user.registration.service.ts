import axios from "axios";
import { User }  from '../interfaces/User'
export const url = axios.create({baseURL: process.env.API_URL })

const registerUser = (newUser: User): Promise<any> =>  {

  try {
    const response = url.post('/api/users/createNew', newUser)

    return response
  } catch (error) {
    throw error;
  }
 
}


export default registerUser
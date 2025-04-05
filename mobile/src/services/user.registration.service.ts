import axios from "axios";
import { User }  from '../interfaces/User'
export const url = axios.create({baseURL: process.env.API_URL })

export const registerUser = (newUser: User): Promise<any> =>  {
  const response = url.post('/api/users/createNew', newUser)

  return response
}
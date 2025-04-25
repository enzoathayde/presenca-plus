import axios from "axios";
import { User }  from '../interfaces/User'
import { API_URL } from '@env';
export const url = axios.create({baseURL: API_URL })

const registerUser = (newUser: User): Promise<any> =>  {

  console.log(url);
  try {
    const response = url.post('/api/users/createNew', newUser)

    return response
  } catch (error) {
    throw error;
  }
 
}


export default registerUser
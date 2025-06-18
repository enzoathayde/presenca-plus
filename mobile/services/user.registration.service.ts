import axios from "axios";
import { User }  from '../interfaces/User'
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
export const url = axios.create({baseURL: API_URL });

const registerUser = (newUser: User): Promise<any> =>  {

  try {
    const response = url.post('/api/users/createNew', newUser)

    return response
  } catch (error) {
    throw error;
  }
 
}


export default registerUser
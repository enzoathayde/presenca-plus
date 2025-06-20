import { User }  from '../interfaces/User'
import { url } from './axios.service'


const registerUser = (newUser: User): Promise<any> =>  {

  console.log(url); // Adicione esta linha


  try {
    const response = url.post('/api/users/createNew', newUser)

    return response
  } catch (error) {
    throw error;
  }
 
}


export default registerUser
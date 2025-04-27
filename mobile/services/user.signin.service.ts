import axios from "axios"
import { url } from "./user.registration.service"


const findUserByEmail = (userEmail: string): Promise<any> =>  {

  try {
    const params: any = new URLSearchParams();
    params.append('email', userEmail)
    const response = url.get('/api/users/findByEmail', { params } )

    return response
  } catch (error) {
    throw error;
  }
 
}


export default findUserByEmail
import { url } from "./axios.service";



const findUserByEmail = (userEmail: string): Promise<any> =>  {

    console.log(url.defaults.baseURL);
  

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
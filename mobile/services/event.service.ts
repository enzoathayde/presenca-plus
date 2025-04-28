import { url } from "./user.registration.service";

const fetchAllEvents = (): Promise<any> =>  {

  try {
    const response = url.get('/api/events/getAll')

    return response
  } catch (error) {
    throw error;
  }
 
}


export default fetchAllEvents;
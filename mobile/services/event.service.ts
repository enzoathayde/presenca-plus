import { url } from "./axios.service";

const fetchAllEvents = (): Promise<any> =>  {

  try {
    const response = url.get('/api/events/getAll')

    return response
  } catch (error) {
    throw error;
  }
 
}

const createNewEvent = (event: any): Promise<any> => {
  try {
    const response = url.post('/api/events/createNew', event)

    return response;
  } catch (error) {
    throw error;
  }
}


export { fetchAllEvents, createNewEvent };
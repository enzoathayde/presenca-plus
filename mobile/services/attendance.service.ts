import { url } from "./user.registration.service";


const createNewAttendance = (attendanceObj: any): Promise<any> =>  {

  try {
    const response = url.post('/api/attendance/createNew', attendanceObj)

    return response
  } catch (error) {
    throw error;
  }
 
}


export default createNewAttendance;
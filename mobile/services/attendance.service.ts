import { url } from "./user.registration.service";


const createNewAttendance = (attendanceObj: any): Promise<any> =>  {

  try {
    const response = url.post('/api/attendance/createNew', attendanceObj)

    return response
  } catch (error) {
    throw error;
  }
 
}

const findAttendancesByUserId = (userId: any): Promise<any> => {
  try {

    const params: any = new URLSearchParams();
    params.append('id', userId)

    const response = url.get('/api/attendance/findByUserId', {params})

    return response
  } catch (error) {
    throw error;
  }
}


export {findAttendancesByUserId, createNewAttendance};
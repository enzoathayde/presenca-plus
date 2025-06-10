import { url } from "./user.registration.service";
import { 
  saveOfflineAttendance, 
  isOnline, 
  OfflineAttendance,
  generateOfflineId,
  getOfflineAttendances
} from './offline.service';

const createNewAttendance = async (attendanceObj: any): Promise<any> => {
  try {
    // Verifica se está online
    const online = await isOnline();
    
    if (!online) {
      // Salva offline
      const offlineAttendance: OfflineAttendance = {
        id: generateOfflineId(),
        eventId: attendanceObj.eventId,
        userId: attendanceObj.userId,
        checkInMethod: attendanceObj.checkInMethod,
        checkInTime: attendanceObj.checkInTime || Date.now(),
        location: attendanceObj.location,
        deviceInfo: attendanceObj.deviceInfo,
        qrCode: attendanceObj.qrCode,
        synced: false,
        timestamp: Date.now()
      };
      
      await saveOfflineAttendance(offlineAttendance);
      
      return {
        status: 201,
        data: offlineAttendance,
        offline: true
      };
    }

    // Está online - envia normalmente
    const response = await url.post('/api/attendance/createNew', attendanceObj);
    return response;
    
  } catch (error) {
    // Se falhar online, tenta salvar offline
    const online = await isOnline();
    if (online) {
      throw error; // Erro real da API
    }
    
    // Salva offline como fallback
    const offlineAttendance: OfflineAttendance = {
      id: generateOfflineId(),
      eventId: attendanceObj.eventId,
      userId: attendanceObj.userId,
      checkInMethod: attendanceObj.checkInMethod,
      checkInTime: attendanceObj.checkInTime || Date.now(),
      location: attendanceObj.location,
      deviceInfo: attendanceObj.deviceInfo,
      qrCode: attendanceObj.qrCode,
      synced: false,
      timestamp: Date.now()
    };
    
    await saveOfflineAttendance(offlineAttendance);
    
    return {
      status: 201,
      data: offlineAttendance,
      offline: true
    };
  }
};

// Função para buscar presenças (online + offline)
const findAttendancesByUserId = async (userId: any): Promise<any> => {
  try {
    const online = await isOnline();
    
    if (online) {
      const params: any = new URLSearchParams();
      params.append('id', userId);
      
      try {
        const response = await url.get('/api/attendance/findByUserId', { params });
        return response;
      } catch (error) {
        // Se falhar online, retorna dados offline
        const offlineAttendances = await getOfflineAttendances();
        const userAttendances = offlineAttendances.filter(att => att.userId === userId);
        
        return {
          data: userAttendances,
          offline: true
        };
      }
    } else {
      // Retorna dados offline
      const offlineAttendances = await getOfflineAttendances();
      const userAttendances = offlineAttendances.filter(att => att.userId === userId);
      
      return {
        data: userAttendances,
        offline: true
      };
    }
  } catch (error) {
    throw error;
  }
};

export { findAttendancesByUserId, createNewAttendance };
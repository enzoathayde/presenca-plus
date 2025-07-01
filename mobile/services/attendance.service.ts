import AsyncStorage from '@react-native-async-storage/async-storage';  
import { getToken } from './auth.service';
import { 
  saveOfflineAttendance, 
  isOnline, 
  OfflineAttendance,
  generateOfflineId,
  getOfflineAttendances
} from './offline.service';
import { url } from './axios.service';

const listAllAttendances = (): Promise<any> => {
  const response = url.get('/api/attendance/getAll')

  return response;
}


const createNewAttendance = (attendanceObj: any): Promise<any> => {

    const headers: any = {
      'Content-Type': 'application/json',
    };

    const response = url.post('/api/attendance/createNew', attendanceObj, {
    headers
  });

  return response;

  // try {
  //   // Verifica se está online
  //   const online = await isOnline();
    
  //   if (!online) {
  //     // Salva offline
  //     const offlineAttendance: OfflineAttendance = {
  //       id: generateOfflineId(),
  //       eventId: attendanceObj.eventId,
  //       userId: attendanceObj.userId,
  //       checkInMethod: attendanceObj.checkInMethod,
  //       checkInTime: attendanceObj.checkInTime || Date.now(),
  //       location: attendanceObj.location,
  //       deviceInfo: attendanceObj.deviceInfo,
  //       qrCode: attendanceObj.qrCode,
  //       synced: false,
  //       timestamp: Date.now()
  //     };
      
  //     await saveOfflineAttendance(offlineAttendance);
      
  //     return {
  //       status: 201,
  //       data: offlineAttendance,
  //       offline: true
  //     };
  //   }

  //   // Prepara dados para envio - garante formato correto
  //   const dataToSend: any = {
  //     eventId: attendanceObj.eventId,
  //     userId: attendanceObj.userId,
  //     imageCheckIn: attendanceObj.imageBase64,
  //     checkInTime: Date.now(), 
  //     location: {
  //       lat: parseFloat(attendanceObj.location.lat),
  //       long: parseFloat(attendanceObj.location.long)
  //     },
  //     deviceInfo: {
  //       brand: attendanceObj.deviceInfo.brand || 'Unknown',
  //       modelName: attendanceObj.deviceInfo.modelName || 'Unknown',
  //       osName: attendanceObj.deviceInfo.osName || 'Unknown',
  //       osVersion: attendanceObj.deviceInfo.osVersion || 'Unknown'
  //     }
  //   };

  //   // Adiciona QR code se existir
  //   if (attendanceObj.qrCode) {
  //     dataToSend.qrCode = attendanceObj.qrCode;
  //   }

  //   console.log("📤 Dados preparados para envio:", dataToSend);

  //   // Pega o token de autenticação (tenta múltiplas fontes)
  //   let token = await AsyncStorage.getItem('@user_token');
    
  //   // Se não tem token salvo, tenta pegar do Firebase
  //   if (!token) {
  //     try {
  //       token = await getToken();
  //       if (token) {
  //         // Salva o token para uso futuro
  //         await AsyncStorage.setItem('@user_token', token);
  //       }
  //     } catch (error) {
  //       console.log('⚠️ Não foi possível obter token do Firebase:', error);
  //     }
  //   }
    
  //   // Configura headers com autenticação
  //   const headers: any = {
  //     'Content-Type': 'application/json',
  //   };
    
  //   if (token) {
  //     headers['Authorization'] = `Bearer ${token}`;
  //     console.log('🔑 Enviando com token:', token.substring(0, 20) + '...');
  //   } else {
  //     console.log('⚠️ Enviando sem token de autenticação');
  //   }

  //   // Está online - envia normalmente
  //   const response = await url.post('/api/attendance/createNew', dataToSend, {
  //     headers
  //   });
    
  //   console.log("✅ Resposta da API:", response.data);
  //   return response;
    
  // } catch (error: any) {
  //   // console.error("❌ Erro na API:", error.response?.data || error.message);
    
  //   // Se falhar online, tenta salvar offline
  //   const online = await isOnline();
  //   if (online) {
  //     // Erro real da API - vamos tentar entender melhor
  //     if (error.response?.status === 400) {
  //       // console.error("📝 Dados que causaram erro 400:", attendanceObj);
  //       // console.error("📝 Resposta da API:", error.response.data);
  //     }
  //     return  error.response.data; // Erro real da API
  //   }
    
  //   // Salva offline como fallback
  //   const offlineAttendance: OfflineAttendance = {
  //     id: generateOfflineId(),
  //     eventId: attendanceObj.eventId,
  //     userId: attendanceObj.userId,
  //     checkInMethod: attendanceObj.checkInMethod,
  //     checkInTime: attendanceObj.checkInTime || Date.now(),
  //     location: attendanceObj.location,
  //     deviceInfo: attendanceObj.deviceInfo,
  //     qrCode: attendanceObj.qrCode,
  //     synced: false,
  //     timestamp: Date.now()
  //   };
    
  //   await saveOfflineAttendance(offlineAttendance);
    
  //   return {
  //     status: 201,
  //     data: offlineAttendance,
  //     offline: true
  //   };
  // }
};

// Função para buscar presenças (online + offline)
const findAttendancesByUserId = async (userId: any): Promise<any> => {
  try {
    const online = await isOnline();
    
    if (online) {
      const params: any = new URLSearchParams();
      params.append('id', userId);
      
      // Pega o token de autenticação (tenta múltiplas fontes)
      let token = await AsyncStorage.getItem('@user_token');
      
      // Se não tem token salvo, tenta pegar do Firebase
      if (!token) {
        try {
          token = await getToken();
          if (token) {
            await AsyncStorage.setItem('@user_token', token);
          }
        } catch (error) {
          console.log('⚠️ Não foi possível obter token do Firebase:', error);
        }
      }
      
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      try {
        const response = await url.get('/api/attendance/findByUserId', { 
          params,
          headers 
        });
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

export { findAttendancesByUserId, createNewAttendance, listAllAttendances};
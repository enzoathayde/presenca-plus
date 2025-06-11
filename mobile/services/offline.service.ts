import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface OfflineAttendance {
  id: string;
  eventId: string;
  userId: string;
  checkInMethod: 'qr' | 'manual';
  checkInTime: number;
  location: {
    lat: number;
    long: number;
  };
  deviceInfo: {
    brand: string | null;
    modelName: string | null;
    osName: string;
    osVersion: string;
  };
  qrCode?: string;
  synced: boolean;
  timestamp: number;
}

const OFFLINE_ATTENDANCE_KEY = '@offline_attendances';
const OFFLINE_EVENTS_KEY = '@offline_events';

// Salva presença offline
export const saveOfflineAttendance = async (attendance: OfflineAttendance): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(OFFLINE_ATTENDANCE_KEY);
    const attendances: OfflineAttendance[] = existingData ? JSON.parse(existingData) : [];
    
    attendances.push(attendance);
    await AsyncStorage.setItem(OFFLINE_ATTENDANCE_KEY, JSON.stringify(attendances));
    
    console.log('✅ Presença salva offline:', attendance.id);
  } catch (error) {
    console.error('❌ Erro ao salvar presença offline:', error);
    throw error;
  }
};

// Recupera presenças offline
export const getOfflineAttendances = async (): Promise<OfflineAttendance[]> => {
  try {
    const data = await AsyncStorage.getItem(OFFLINE_ATTENDANCE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('❌ Erro ao buscar presenças offline:', error);
    return [];
  }
};

// Remove presença sincronizada
export const removeOfflineAttendance = async (id: string): Promise<void> => {
  try {
    const attendances = await getOfflineAttendances();
    const filtered = attendances.filter(attendance => attendance.id !== id);
    await AsyncStorage.setItem(OFFLINE_ATTENDANCE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('❌ Erro ao remover presença offline:', error);
  }
};

// Verifica conectividade
export const isOnline = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected === true;
};

// Salva eventos para acesso offline
export const saveEventsOffline = async (events: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(OFFLINE_EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('❌ Erro ao salvar eventos offline:', error);
  }
};

// Recupera eventos offline
export const getOfflineEvents = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(OFFLINE_EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('❌ Erro ao buscar eventos offline:', error);
    return [];
  }
};

// Gera ID único para uso offline
export const generateOfflineId = (): string => {
  return 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}; 
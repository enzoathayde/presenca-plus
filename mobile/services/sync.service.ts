import { 
  getOfflineAttendances, 
  removeOfflineAttendance, 
  isOnline,
  OfflineAttendance 
} from './offline.service';
import { url } from './user.registration.service';

interface AttendanceApiData {
  eventId: string;
  userId: string;
  checkInMethod: string;
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
}

interface ApiResponse {
  status: number;
  data: any;
}

export class SyncService {
  private static instance: SyncService;
  private isSyncing: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly API_ENDPOINT: string = '/api/attendance/createNew';

  private constructor() {}

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * Sincroniza todas as presenças offline pendentes
   */
  public async syncOfflineAttendances(): Promise<{ success: number; errors: number }> {
    if (this.isSyncing) {
      console.log('🔄 Sincronização já em andamento...');
      return { success: 0, errors: 0 };
    }

    try {
      this.isSyncing = true;
      
      const online = await isOnline();
      if (!online) {
        console.log('📡 Sem conexão - sincronização cancelada');
        return { success: 0, errors: 0 };
      }

      const offlineAttendances = await getOfflineAttendances();
      const unsyncedAttendances = offlineAttendances.filter(att => !att.synced);

      if (unsyncedAttendances.length === 0) {
        console.log('✅ Nenhuma presença para sincronizar');
        return { success: 0, errors: 0 };
      }

      console.log(`🔄 Sincronizando ${unsyncedAttendances.length} presenças...`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = unsyncedAttendances.length - 1; i >= 0; i--) {
        const attendance = unsyncedAttendances[i];
        try {
          await this.syncSingleAttendance(attendance);
          await removeOfflineAttendance(attendance.id);
          successCount++;
          console.log(`✅ Presença ${attendance.id} sincronizada`);
          unsyncedAttendances.splice(i, 1); // Remove pelo índice correto
        } catch (error) {
          errorCount++;
          console.error(`❌ Erro ao sincronizar presença ${attendance.id}:`, error);
          // Continua para a próxima mesmo se uma falhar
        }
      }

      console.log(`🎉 Sincronização concluída! Sucesso: ${successCount}, Erros: ${errorCount}`);
      return { success: successCount, errors: errorCount };
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sincroniza uma única presença
   */
  private async syncSingleAttendance(attendance: OfflineAttendance): Promise<void> {
    // Converte os dados para o formato esperado pela API
    const attendanceData: AttendanceApiData = {
      eventId: attendance.eventId,
      userId: attendance.userId,
      checkInMethod: attendance.checkInMethod,
      checkInTime: attendance.checkInTime,
      location: {
        lat: attendance.location.lat,
        long: attendance.location.long,
      },
      deviceInfo: {
        brand: attendance.deviceInfo.brand,
        modelName: attendance.deviceInfo.modelName,
        osName: attendance.deviceInfo.osName,
        osVersion: attendance.deviceInfo.osVersion,
      },
      ...(attendance.qrCode && { qrCode: attendance.qrCode })
    };

    const response = await this.createAttendanceDirectly(attendanceData);
    
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`Erro do servidor: ${response.status} - ${response.data?.error || 'Erro desconhecido'}`);
    }
  }

  /**
   * Faz a requisição direta para a API sem passar pelo serviço de attendance
   * (evita loop infinito com verificação offline)
   */
  private async createAttendanceDirectly(attendanceObj: AttendanceApiData): Promise<ApiResponse> {
    try {
      console.log('📤 Enviando presença para API:', attendanceObj);
      
      const response = await url.post(this.API_ENDPOINT, attendanceObj);
      
      console.log('📥 Resposta da API:', {
        status: response.status,
        data: response.data
      });
      
      return {
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ Erro na requisição direta:', error);
      
      // Tratamento específico de erros HTTP
      if (error.response) {
        const errorMessage = error.response.data?.error || error.response.statusText || 'Erro no servidor';
        throw new Error(`HTTP ${error.response.status}: ${errorMessage}`);
      }
      
      // Erro de rede ou timeout
      if (error.request) {
        throw new Error('Erro de conexão: Não foi possível conectar ao servidor');
      }
      
      // Outros erros
      throw new Error(`Erro inesperado: ${error.message}`);
    }
  }

  /**
   * Inicia sincronização automática em intervalo regular
   */
  public startAutoSync(intervalMs: number = 30000): void {
    console.log(`🚀 Iniciando sincronização automática (${intervalMs}ms)`);
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      try {
        await this.syncOfflineAttendances();
      } catch (error) {
        console.error('❌ Erro na sincronização automática:', error);
      }
    }, intervalMs);
  }

  /**
   * Para a sincronização automática
   */
  public stopAutoSync(): void {
    console.log('⏹️ Parando sincronização automática');
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Força uma sincronização imediata
   */
  public async forceSync(): Promise<{ success: boolean; results?: { success: number; errors: number } }> {
    try {
      console.log('🔄 Iniciando sincronização forçada...');
      
      const results = await this.syncOfflineAttendances();
      
      console.log('✅ Sincronização forçada concluída:', results);
      
      return { 
        success: true, 
        results 
      };
    } catch (error) {
      console.error('❌ Erro na sincronização forçada:', error);
      return { 
        success: false 
      };
    }
  }

  /**
   * Verifica se há sincronização em andamento
   */
  public get isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  /**
   * Verifica se a sincronização automática está ativa
   */
  public get isAutoSyncActive(): boolean {
    return this.syncInterval !== null;
  }

  /**
   * Obtém estatísticas das presenças offline
   */
  public async getOfflineStats(): Promise<{
    total: number;
    pending: number;
    synced: number;
  }> {
    try {
      const offlineAttendances = await getOfflineAttendances();
      const pending = offlineAttendances.filter(att => !att.synced).length;
      const synced = offlineAttendances.filter(att => att.synced).length;
      
      return {
        total: offlineAttendances.length,
        pending,
        synced
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas offline:', error);
      return {
        total: 0,
        pending: 0,
        synced: 0
      };
    }
  }

  /**
   * Limpa dados já sincronizados (para limpeza de cache)
   */
  public async cleanupSyncedData(): Promise<number> {
    try {
      const offlineAttendances = await getOfflineAttendances();
      const syncedAttendances = offlineAttendances.filter(att => att.synced);
      
      let removedCount = 0;
      for (const attendance of syncedAttendances) {
        await removeOfflineAttendance(attendance.id);
        removedCount++;
      }
      
      console.log(`🧹 Limpeza concluída: ${removedCount} registros removidos`);
      return removedCount;
    } catch (error) {
      console.error('❌ Erro na limpeza de dados:', error);
      return 0;
    }
  }
}

// Exporta instância singleton para uso direto
export const syncService = SyncService.getInstance();
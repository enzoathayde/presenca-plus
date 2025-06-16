import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store'
import { useEffect } from 'react';
import { SyncService } from '../services/sync.service';
import NetInfo from '@react-native-community/netinfo';

export default function RootLayout() {
  useEffect(() => {
    // Inicia o serviço de sincronização automática
    const syncService = SyncService.getInstance();
    syncService.startAutoSync();
    
    // Listener para mudanças de conectividade
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('🌐 Conexão restaurada - iniciando sincronização');
        syncService.syncOfflineAttendances();
      } else {
        console.log('📱 Conexão perdida - modo offline ativado');
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      syncService.stopAutoSync();
    };
  }, []);

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="events" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="qrcode" />
        <Stack.Screen name="eventsRegistry" />
        <Stack.Screen name="createUser" />
        <Stack.Screen name="listAlunos" />
        <Stack.Screen name="userView" />
        <Stack.Screen name="allowLocationScreen" />
      </Stack>
    </Provider>
  );
}


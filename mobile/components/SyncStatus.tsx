import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { getOfflineAttendances, isOnline } from '../services/offline.service';
import { SyncService } from '../services/sync.service';
import { setPendingSync, setSyncStatus, setIsConnected } from '../slices/attendanceSlice';

export const SyncStatus: React.FC = () => {
  const dispatch = useDispatch();
  const { syncStatus, pendingSync, isConnected } = useSelector((state: any) => state.attendance);

  useEffect(() => {
    const checkPendingSync = async () => {
      const offlineAttendances = await getOfflineAttendances();
      const pending = offlineAttendances.filter(att => !att.synced).length;
      dispatch(setPendingSync(pending));
    };

    const checkConnection = async () => {
      const connected = await isOnline();
      dispatch(setIsConnected(connected));
    };

    checkPendingSync();
    checkConnection();

    // Verifica a cada 10 segundos
    const interval = setInterval(() => {
      checkPendingSync();
      checkConnection();
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleManualSync = async () => {
    dispatch(setSyncStatus('syncing'));
    try {
      const result = await SyncService.getInstance().forceSync();
      if (result.success) {
        dispatch(setSyncStatus('success'));
        Alert.alert('Sucesso', 'Sincronização concluída com sucesso!');
      } else {
        dispatch(setSyncStatus('error'));
        Alert.alert('Erro', 'Falha na sincronização. Tente novamente.');
      }
      setTimeout(() => dispatch(setSyncStatus('idle')), 3000);
    } catch (error) {
      dispatch(setSyncStatus('error'));
      Alert.alert('Erro', 'Erro inesperado na sincronização.');
      setTimeout(() => dispatch(setSyncStatus('idle')), 3000);
    }
  };

  if (pendingSync === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <MaterialIcons 
          name={isConnected ? "cloud-queue" : "cloud-off"} 
          size={20} 
          color={isConnected ? "#69b932" : "#ff6b6b"} 
        />
        <Text style={styles.statusText}>
          {pendingSync} presença{pendingSync > 1 ? 's' : ''} aguardando sincronização
        </Text>
      </View>
      
      {isConnected && (
        <TouchableOpacity 
          style={[styles.syncButton, syncStatus === 'syncing' && styles.syncButtonDisabled]} 
          onPress={handleManualSync}
          disabled={syncStatus === 'syncing'}
        >
          <MaterialIcons 
            name="sync" 
            size={16} 
            color="white"
          />
          <Text style={styles.syncButtonText}>
            {syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#69b932',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  syncButton: {
    backgroundColor: '#69b932',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#ccc',
  },
  syncButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
}); 
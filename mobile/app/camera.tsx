import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewAttendance } from '../services/attendance.service';
import { isOnline } from '../services/offline.service';
import { setOfflineMode } from '../slices/attendanceSlice';

type CameraViewType = {
  takePictureAsync: () => Promise<{ uri: string }>;
};

const ScannerScreen: React.FC<any> = () => {
  const dispatch = useDispatch();
  const typeAttendance = useSelector(
    (state: RootState) => state.attendance.typeAttendance
  );
  const eventId = useSelector(
    (state: RootState) => state.attendance.eventId
  );

  console.log('🎯 Debug Camera - Tipo de presença:', typeAttendance);
  console.log('🎯 Debug Camera - ID do evento:', eventId);

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewType | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica conexão periodicamente
  useEffect(() => {
    const checkConnection = async () => {
      const online = await isOnline();
      setConnectionStatus(online);
      dispatch(setOfflineMode(!online));
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  // Verifica se os dados necessários estão disponíveis
  useEffect(() => {
    const checkRequiredData = async () => {
      console.log('🔍 Verificando dados necessários...');
      
      if (!typeAttendance || !eventId) {
        console.log('❌ Dados incompletos:', { typeAttendance, eventId });
        Alert.alert(
          'Erro', 
          'Dados de presença não encontrados. Retornando para eventos.',
          [{ text: 'OK', onPress: () => router.push('/events') }]
        );
        return;
      }

      console.log('✅ Dados OK, configurando câmera...');
      setIsLoading(false);
    };

    checkRequiredData();
  }, [typeAttendance, eventId]);

  // Loading enquanto verifica dados
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#69b932" />
        <Text style={styles.loadingText}>Preparando câmera...</Text>
      </View>
    );
  }

  // Verifica permissão da câmera
  if (!permission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#69b932" />
        <Text style={styles.loadingText}>Verificando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.message}>
          Precisamos da sua permissão para acessar a câmera.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Verifica se o tipo de presença é válido
  if (!typeAttendance || (typeAttendance !== 'qr' && typeAttendance !== 'manual')) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.message}>
          Tipo de presença inválido: "{typeAttendance}"
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => router.push('/events')}
        >
          <Text style={styles.permissionButtonText}>Voltar para Eventos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Função auxiliar para mostrar feedback de modo offline
  const showOfflineSuccess = () => {
    Alert.alert(
      '📱 Registrado Offline', 
      'Sua presença foi salva localmente e será sincronizada quando houver conexão com a internet.',
      [{ text: 'OK', onPress: () => router.push('/events') }]
    );
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    console.log('📱 QR Code escaneado:', data);
    
    try {
      const userIdResponse = await AsyncStorage.getItem('id');
      
      if (!userIdResponse) {
        Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
        router.push('/login');
        return;
      }

      const attendanceObject = {
        eventId: eventId,
        userId: userIdResponse,
        checkInMethod: 'qr',
        checkInTime: Date.now(),
        location: {
          lat: 0,
          long: 0,
        },
        deviceInfo: {
          brand: Device.brand,
          modelName: Device.modelName,
          osName: Device.osName || 'Unknown',
          osVersion: Device.osVersion || 'Unknown',
        },
        qrCode: data
      };

      console.log('📤 Enviando presença QR:', attendanceObject);
      const response = await createNewAttendance(attendanceObject);

      if (response.offline) {
        showOfflineSuccess();
        return;
      }

      if (response.status !== 200 && response.status !== 201) {
        console.error('❌ Erro na resposta:', response.error);
        Alert.alert('Erro', response.error);
        router.push('/events');
        return;
      }

      Alert.alert('Sucesso', 'Presença registrada com sucesso!');
      router.push('/events');
    } catch (error: any) {
      console.error('❌ Erro ao registrar presença QR:', error);
      Alert.alert('Erro', 'caiu na vila ');
      router.push('/events');
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert('Erro', 'Câmera não está disponível.');
      return;
    }

    try {
      console.log('📷 Tirando foto...');
      const photo = await cameraRef.current.takePictureAsync();
      console.log('✅ Foto tirada:', photo.uri);

      setIsCameraActive(false);

      // Solicita permissão para acessar a localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'A localização não pode ser acessada.');
        router.push("/events");
        return;
      }

      console.log('📍 Obtendo localização...');
      // Obtém a localização atual
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log('📍 Localização obtida:', { latitude, longitude });

      // Obtém informações do dispositivo
      const deviceInfo = {
        brand: Device.brand,
        modelName: Device.modelName,
        osName: Device.osName || 'Unknown',
        osVersion: Device.osVersion || 'Unknown',
      };

      // Obtém o ID do usuário do AsyncStorage
      const userIdResponse = await AsyncStorage.getItem('id');

      if (!userIdResponse) {
        Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
        router.push('/login');
        return;
      }

      // Cria o objeto de presença
      const attendanceObject = {
        eventId: eventId,
        userId: userIdResponse,
        checkInMethod: typeAttendance,
        checkInTime: Date.now(),
        location: {
          lat: latitude,
          long: longitude,
        },
        deviceInfo: deviceInfo,
      };

      console.log("📤 Enviando presença manual:", attendanceObject);

      // Envia os dados para o backend usando a service
      const response = await createNewAttendance(attendanceObject);

      if (response.offline) {
        showOfflineSuccess();
        return;
      }

      console.log('✅ Resposta do servidor:', response);

      // Feedback de sucesso
      Alert.alert('Sucesso', 'Presença registrada com sucesso!');
      router.push("/events");
    } catch (error: any) {
      console.error('❌ Erro ao registrar presença manual:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Dados inválidos enviados para o servidor.';
        Alert.alert('Erro de Validação', errorMessage);
      } else if (error.response?.status === 401) {
        Alert.alert('Erro de Autenticação', 'Por favor, faça login novamente.');
      } else if (error.response?.status === 403) {
        Alert.alert('Erro de Permissão', 'Você não tem permissão para registrar presença neste evento.');
      } else if (error.response?.status >= 500) {
        Alert.alert('Erro do Servidor', 'Problema interno do servidor. Tente novamente mais tarde.');
      } else if (error.message?.includes('Network Error')) {
        Alert.alert('Erro de Conexão', 'Verifique sua conexão com a internet.');
      } else {
        Alert.alert('Erro', error.message || 'Não foi possível completar a operação.');
      }
      
      router.push("/events");
    }
  };

  return (
    <View style={styles.container}>
      {/* Indicador de status de conexão */}
      {!connectionStatus && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>📱 Modo Offline - Dados serão sincronizados</Text>
        </View>
      )}

      {/* Debug info - remova em produção */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Modo: {typeAttendance} | Evento: {eventId?.substring(0, 8)}...
        </Text>
      </View>

      {typeAttendance === 'qr' && (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.frame} />
            <Text style={styles.instruction}>Aponte a câmera para o QR Code</Text>
          </View>
        </CameraView>
      )}

      {typeAttendance === 'manual' && isCameraActive && (
        <CameraView
          ref={cameraRef as any}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.overlay}>
            <View style={styles.frame} />
            <Text style={styles.instruction}>Tire uma foto para marcar presença</Text>

            <View style={styles.controls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
              >
                <Text style={styles.controlText}>🔄 Inverter</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlButton}
                onPress={takePicture}
              >
                <Text style={styles.controlText}>📸 Tirar Foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  debugInfo: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  offlineIndicator: {
    backgroundColor: '#ff9800',
    padding: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  message: {
    textAlign: 'center',
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  permissionButton: {
    backgroundColor: '#69b932',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#69b932',
    borderRadius: 16,
  },
  instruction: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(105, 185, 50, 0.8)',
    padding: 12,
    borderRadius: 8,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScannerScreen;
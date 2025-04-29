import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';
import * as Location from 'expo-location'; 
import * as Device from 'expo-device'; 
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewAttendance } from '../services/attendance.service';

// Forçando a tipagem manual para o CameraView
type CameraViewType = {
  takePictureAsync: () => Promise<{ uri: string }>;
};

const ScannerScreen: React.FC<any> = () => {
  const typeAttendance = useSelector(
    (state: RootState) => state.attendance.typeAttendance
  );
  const eventId = useSelector(
    (state: RootState) => state.attendance.eventId
  )

  console.log('Tipo de presença solicitada:', typeAttendance); 
  console.log('id do evento:', eventId); 

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewType | null>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para acessar a câmera.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Função para ler QR Code
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    Alert.alert('QR Code Lido', `Conteúdo: ${data}`);
    router.push("/events");
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // Captura a foto
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Foto Tirada', `Foto salva em: ${photo.uri}`);

        // Solicita permissão para acessar a localização
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'A localização não pode ser acessada.');
          router.push("/events");
        }

        // Obtém a localização atual
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Obtém informações do dispositivo
        const deviceInfo = {
          brand: Device.brand,
          modelName: Device.modelName,
          osName: Device.osName,
          osVersion: Device.osVersion,
        };

        // Obtém o ID do usuário do AsyncStorage
        const userIdResponse = await AsyncStorage.getItem('id');

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

        console.log("OBJETO A SER ENCAMINHADO PRO BACKEND", attendanceObject);

        // Envia os dados para o backend usando a service
        const response = await createNewAttendance(attendanceObject);

        console.log(response)



        // Feedback de sucesso
        Alert.alert('Sucesso', 'Presença registrada com sucesso!');
        router.push("/events");
      } catch (error: any) {

        if(error.status == 400) {
          console.log('Erro ao registrar presença: Fora de alcance',);
          router.push("/events");
        }
        console.error('Erro ao registrar presença:', error.message);
        Alert.alert('Erro', error.message || 'Não foi possível completar a operação.');
        router.push("/events");
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* Renderização condicional com base no tipo de presença */}
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

      {typeAttendance === 'manual' && (
        <CameraView
          ref={cameraRef as any}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.overlay}>
            <View style={styles.frame} />
            <Text style={styles.instruction}>Tire uma foto para marcar presença</Text>

            <View style={styles.controls}>
              <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
                <Text style={styles.controlText}>🔄 Inverter</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={takePicture}>
                <Text style={styles.controlText}>📸 Tirar Foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}

      {/* Caso o tipo de presença não seja reconhecido */}
      {typeAttendance !== 'qr' && typeAttendance !== 'manual' && (
        <View style={styles.container}>
          <Text style={styles.message}>Tipo de presença inválido.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 20,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 20,
  },
});

export default ScannerScreen;
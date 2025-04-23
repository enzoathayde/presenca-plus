import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  CameraView,
  CameraType,
  FlashMode as FlashModeType, // Importando o tipo
  useCameraPermissions,
  FlashMode, // Importando os valores (enum)
} from 'expo-camera';

export default function QRCodeScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashModeType>('off'); // Usando o tipo FlashModeType
  const [permission, requestPermission] = useCameraPermissions();

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

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    Alert.alert('QR Code Lido', `Conteúdo: ${data}`);
    // Adicione navegação ou lógica extra aqui se quiser
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        flash={flash}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.frame} />
          <Text style={styles.instruction}>Aponte a câmera para o QR Code</Text>

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
              <Text style={styles.controlText}>🔄 Inverter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setFlash(flash === 'off' ? 'on' : 'off')
              }
            >
              <Text style={styles.controlText}>
                {flash === 'on' ? '💡 Flash ON' : '🔦 Flash OFF'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

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
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';

export default function AllowLocationScreen() {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if(status === 'granted') {
        router.replace('/login')
      }
      
      setPermissionStatus(status);
    })();
  }, []);

  const handleRequestPermission = async () => {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);
    if (status === 'granted') {
      router.replace('/login');
    } else if (!canAskAgain) {
      // O usuário selecionou "Não perguntar novamente"
      // Oriente-o a conceder a permissão manualmente nas configurações
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permitir Localização</Text>
      <Text style={styles.subtitle}>
        Para continuar, precisamos acessar sua localização.
      </Text>
      {permissionStatus === 'denied' ? (
        <>
          <Text style={styles.warning}>
            A permissão de localização foi negada. Por favor, ative-a nas configurações do dispositivo.
          </Text>
          <TouchableOpacity onPress={openAppSettings} style={styles.button}>
            <Text style={styles.buttonText}>Abrir Configurações</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handleRequestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Permitir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 30,
  },
  warning: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#69b932',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

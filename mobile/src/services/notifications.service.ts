import messaging from '@react-native-firebase/messaging';

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Permissão de notificação não concedida');
      return null;
    }

    const token = await messaging().getToken();
    console.log('✅ Token FCM real:', token);
    return token;
  } catch (err) {
    console.error('Erro ao obter token FCM:', err);
    return null;
  }
};

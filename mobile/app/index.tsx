import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import messaging from '@react-native-firebase/messaging';
import { Alert, Image, Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import EventsScreen from '../app/events'
import LoginScreen from './login';
import RegisterScreen from '../app/register';




const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Events" component={EventsScreen} options={{
        tabBarIcon: () => (
          <Image
            source={require('../assets/calendar-check.png')}
            style={{ width: 20, height: 20 }}
          />
      ),
      }}
      />
    </Tab.Navigator>
  );
}

export default function Index() {

  // useEffect(() => {
  //   const getToken = async () => {
  //     const fcmToken = await getFCMToken();
  //     if (fcmToken) {
  //       console.log('📲 FCM Token:', fcmToken);
  //       Alert.alert('FCM Token', fcmToken);
  //     } else {
  //       console.log('❌ FCM Token não encontrado');
  //     }
  //   };
  
  //   getToken();
  
  //   // ✅ Ouve mensagens em primeiro plano
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('🔔 Notificação recebida em primeiro plano:', remoteMessage);
  
  //     Alert.alert(
  //       remoteMessage.notification?.title ?? 'Nova Notificação',
  //       remoteMessage.notification?.body ?? ''
  //     );
  //   });

  //   if (Platform.OS === 'android') {
  //     Notifications.setNotificationChannelAsync('default', {
  //       name: 'default',
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: '#FF231F7C',
  //     });
  //   }
  
  //   // Cleanup
  //   return unsubscribe;
  // }, []);
  


  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen}/> 
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
  );
}

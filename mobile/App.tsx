import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/components/LoginScreen';
import FriendsScreen from './src/components/FriendsScreen';
import HomeScreen from './src/components/HomeScreen';
import { getFCMToken } from './src/services/notifications.service';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import RegisterScreen from './RegisterScreen';
import LoggedScreen from './src/components/LoggedScreen';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegação das abas (menu inferior)
function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Logged" component={LoggedScreen} />
        <Stack.Screen name="Register" component={RegisterScreen}/> 
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

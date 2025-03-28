import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/LoginScreen';
import FriendsScreen from './src/FriendsScreen';
import HomeScreen from './src/HomeScreen';


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
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tela de Login será a primeira */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Após o login, exibe o menu de abas */}
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

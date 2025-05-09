import { View, Text, StyleSheet } from 'react-native';
import LoginScreen from './login';
import PermissionScreen from './allowLocationScreen';


export default function Index() {
  return (
    <>
      <PermissionScreen />
    </>
  );
}


import { View, Text, StyleSheet } from 'react-native';
import LoginScreen from './login';
import PermissionScreen from './allowLocationScreen';
import React from 'react';


export default function Index() {
  return (
    <>
      <PermissionScreen />
    </>
  );
}


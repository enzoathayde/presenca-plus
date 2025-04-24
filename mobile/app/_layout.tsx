import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native'
import { useRootNavigationState, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';



export default function RootLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
      <Stack.Screen name="events" options={{ title: 'Events' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({})
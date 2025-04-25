import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native'

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
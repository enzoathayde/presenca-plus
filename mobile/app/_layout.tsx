import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store'



export default function RootLayout() {

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="events" options={{ title: 'Events' }} />
      </Stack>
    </Provider>
  );
}


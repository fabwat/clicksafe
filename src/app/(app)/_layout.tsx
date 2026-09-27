import { Stack } from 'expo-router';

import { palette } from '@/constants/colors';

export default function AppGroupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: palette.cream },
        headerTintColor: palette.ink,
        contentStyle: { backgroundColor: palette.cream },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="checkin-settings" options={{ title: 'Check-in' }} />
      <Stack.Screen name="contact" options={{ title: 'Contato de emergência' }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
      <Stack.Screen name="notification-method" options={{ title: 'Método de notificação' }} />
      <Stack.Screen name="emergency-message" options={{ title: 'Mensagem de emergência' }} />
      <Stack.Screen name="timezone" options={{ title: 'Fuso horário' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';

import { palette } from '@/constants/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.cream },
      }}
    />
  );
}

import { Redirect } from 'expo-router';

import { useAppStore } from '@/store/appStore';

export default function IndexScreen() {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}

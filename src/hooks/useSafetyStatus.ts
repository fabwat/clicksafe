import { useMemo } from 'react';

import { selectSafetyStatus, useAppStore } from '@/store/appStore';

export function useSafetyStatus() {
  const settings = useAppStore((state) => state.settings);
  const alerts = useAppStore((state) => state.alerts);

  return useMemo(() => selectSafetyStatus(useAppStore.getState()), [settings, alerts]);
}

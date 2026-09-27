import { useEffect } from 'react';
import { AppState } from 'react-native';

import { maybeDeliverEmergencyAlert } from '@/features/alerts/deliverContactMessage';
import { useAppStore } from '@/store/appStore';

const CHECK_INTERVAL_MS = 15_000;

export function useEmergencyAlert() {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const nextDeadlineAt = useAppStore((state) => state.settings.nextDeadlineAt);
  const gracePeriodMinutes = useAppStore((state) => state.settings.gracePeriodMinutes);
  const enabled = useAppStore((state) => state.settings.enabled);
  const contactKey = useAppStore((state) => {
    const contact = state.contacts[0];
    return contact ? `${contact.id}:${contact.updatedAt}:${contact.notificationMethod}` : '';
  });
  const alertKey = useAppStore((state) =>
    state.alerts.map((alert) => `${alert.checkinDeadline}:${alert.status}`).join('|'),
  );

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      return;
    }

    const run = () => {
      void maybeDeliverEmergencyAlert();
    };

    run();
    const interval = setInterval(run, CHECK_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        run();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [hasCompletedOnboarding, nextDeadlineAt, gracePeriodMinutes, enabled, contactKey, alertKey]);
}

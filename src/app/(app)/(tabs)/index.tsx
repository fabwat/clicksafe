import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CheckinButton } from '@/components/checkin/CheckinButton';
import { CheckinSuccessOverlay } from '@/components/checkin/CheckinSuccessOverlay';
import { DeadlineCard } from '@/components/checkin/DeadlineCard';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ContactPreview } from '@/features/contacts/ContactPreview';
import { useSafetyStatus } from '@/hooks/useSafetyStatus';
import { useAppStore } from '@/store/appStore';
import { formatDateTime } from '@/utils/dates';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const settings = useAppStore((state) => state.settings);
  const contact = useAppStore((state) => state.contacts[0] ?? null);
  const lastCheckin = useAppStore((state) => state.checkins[0] ?? null);
  const performCheckin = useAppStore((state) => state.performCheckin);
  const status = useSafetyStatus();
  const [overlay, setOverlay] = useState({ visible: false, message: '', nextCheckinLabel: '' });

  if (!profile || !settings) {
    return null;
  }

  function handleCheckin() {
    const result = performCheckin();
    setOverlay({
      visible: true,
      message: result.message,
      nextCheckinLabel: result.nextCheckinLabel,
    });
    setTimeout(() => {
      setOverlay((current) => ({ ...current, visible: false }));
    }, 1800);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="caption">Olá,</AppText>
        <AppText variant="display">{profile.name}</AppText>
      </View>

      <StatusBadge status={status} />
      <CheckinButton status={status} onPress={handleCheckin} />
      <DeadlineCard
        lastCheckinLabel={
          lastCheckin ? formatDateTime(lastCheckin.checkedInAt, profile.timezone) : 'Nenhum ainda'
        }
        nextCheckinLabel={formatDateTime(settings.nextDeadlineAt, profile.timezone)}
      />

      <Pressable
        onPress={() => router.push('/(app)/contact')}
        accessibilityRole="button"
        accessibilityLabel="Abrir contato de emergência"
        style={styles.contact}>
        <ContactPreview contact={contact} />
      </Pressable>

      <CheckinSuccessOverlay
        visible={overlay.visible}
        message={overlay.message}
        nextCheckinLabel={overlay.nextCheckinLabel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    marginBottom: 16,
    gap: 2,
  },
  contact: {
    marginTop: 14,
  },
});

import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { HistoryTimeline } from '@/features/history/HistoryTimeline';
import { useAppStore } from '@/store/appStore';

export default function HistoryScreen() {
  const profile = useAppStore((state) => state.profile);
  const history = useAppStore((state) => state.history);

  if (!profile) {
    return null;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Histórico</AppText>
        <AppText variant="caption">Check-ins, atrasos e alertas em ordem recente.</AppText>
      </View>
      <HistoryTimeline events={history} timezone={profile.timezone} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    marginBottom: 20,
    gap: 6,
  },
});

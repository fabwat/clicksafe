import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { palette } from '@/constants/colors';
import type { HistoryEvent, HistoryEventType } from '@/types';

const iconByType: Record<HistoryEventType, keyof typeof Ionicons.glyphMap> = {
  checkin: 'checkmark-circle',
  missed_checkin: 'close-circle',
  alert_sent: 'alert-circle',
  alert_failed: 'warning',
  test_message: 'chatbubble-ellipses',
};

const colorByType: Record<HistoryEventType, string> = {
  checkin: palette.leaf,
  missed_checkin: palette.orange,
  alert_sent: palette.crimson,
  alert_failed: palette.amber,
  test_message: palette.forest,
};

interface HistoryItemProps {
  event: HistoryEvent;
  timeLabel: string;
}

export function HistoryItem({ event, timeLabel }: HistoryItemProps) {
  return (
    <View style={styles.row}>
      <Ionicons name={iconByType[event.type]} size={22} color={colorByType[event.type]} />
      <View style={styles.copy}>
        <AppText variant="caption">{timeLabel}</AppText>
        <AppText variant="subtitle">{event.title}</AppText>
        <AppText variant="caption">{event.description}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});

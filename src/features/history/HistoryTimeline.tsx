import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { palette } from '@/constants/colors';
import type { HistoryEvent } from '@/types';
import { formatDayHeading, formatTime } from '@/utils/dates';

import { HistoryItem } from './HistoryItem';

interface HistoryTimelineProps {
  events: HistoryEvent[];
  timezone: string;
}

export function HistoryTimeline({ events, timezone }: HistoryTimelineProps) {
  if (events.length === 0) {
    return (
      <View style={styles.empty}>
        <AppText variant="subtitle" centered>
          Nenhum evento ainda
        </AppText>
        <AppText variant="caption" centered>
          Seus check-ins e alertas aparecerão aqui.
        </AppText>
      </View>
    );
  }

  const grouped = new Map<string, HistoryEvent[]>();
  for (const event of events) {
    const key = formatDayHeading(event.occurredAt, timezone);
    const bucket = grouped.get(key) ?? [];
    bucket.push(event);
    grouped.set(key, bucket);
  }

  return (
    <View style={styles.list}>
      {[...grouped.entries()].map(([day, dayEvents]) => (
        <View key={day} style={styles.group}>
          <AppText variant="label">{day.toUpperCase()}</AppText>
          {dayEvents.map((event) => (
            <HistoryItem
              key={event.id}
              event={event}
              timeLabel={formatTime(event.occurredAt, timezone)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 22,
  },
  group: {
    gap: 10,
  },
  empty: {
    paddingVertical: 40,
    gap: 8,
    borderRadius: 20,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 20,
  },
});

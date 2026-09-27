import { StyleSheet, View } from 'react-native';

import { palette } from '@/constants/colors';

import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';

interface DeadlineCardProps {
  lastCheckinLabel: string;
  nextCheckinLabel: string;
}

export function DeadlineCard({ lastCheckinLabel, nextCheckinLabel }: DeadlineCardProps) {
  return (
    <Card>
      <View style={styles.row}>
        <AppText variant="label">ÚLTIMO CHECK-IN</AppText>
        <AppText variant="subtitle">{lastCheckinLabel}</AppText>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <AppText variant="label">PRÓXIMO CHECK-IN ATÉ</AppText>
        <AppText variant="subtitle">{nextCheckinLabel}</AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: palette.line,
    marginVertical: 10,
  },
});

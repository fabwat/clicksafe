import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { statusTheme } from '@/constants/colors';
import type { SafetyStatus } from '@/types';

import { AppText } from './AppText';

interface StatusBadgeProps {
  status: SafetyStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const theme = statusTheme[status];

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${theme.label}. ${theme.description}`}
      style={[styles.badge, { backgroundColor: theme.background }]}>
      <Ionicons name={theme.icon} size={20} color={theme.color} />
      <View style={styles.copy}>
        <AppText variant="subtitle" color={theme.color}>
          {theme.label}
        </AppText>
        <AppText variant="caption" color={theme.color}>
          {theme.description}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});

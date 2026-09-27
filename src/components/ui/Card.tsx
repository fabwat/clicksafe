import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { palette } from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 6,
  },
});

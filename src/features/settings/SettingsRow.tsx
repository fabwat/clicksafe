import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { palette } from '@/constants/colors';
import { AppText } from '@/components/ui/AppText';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  destructive?: boolean;
  onPress: () => void;
}

export function SettingsRow({ icon, title, value, destructive = false, onPress }: SettingsRowProps) {
  const color = destructive ? palette.crimson : palette.ink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${title}, ${value}` : title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.copy}>
        <AppText variant="subtitle" color={color}>
          {title}
        </AppText>
        {value ? <AppText variant="caption">{value}</AppText> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});

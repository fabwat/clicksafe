import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { palette } from '@/constants/colors';

import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const backgrounds: Record<Variant, string> = {
  primary: palette.forest,
  secondary: palette.white,
  ghost: 'transparent',
  danger: palette.crimsonSoft,
};

const labels: Record<Variant, string> = {
  primary: palette.white,
  secondary: palette.forest,
  ghost: palette.forest,
  danger: palette.crimson,
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: backgrounds[variant] },
        variant === 'secondary' && styles.secondaryBorder,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={labels[variant]} />
      ) : (
        <AppText variant="subtitle" color={labels[variant]}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryBorder: {
    borderWidth: 1.5,
    borderColor: palette.line,
  },
  ghost: {
    minHeight: 44,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});

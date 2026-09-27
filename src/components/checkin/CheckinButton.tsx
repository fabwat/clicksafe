import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { palette, statusTheme } from '@/constants/colors';
import type { SafetyStatus } from '@/types';

import { AppText } from '../ui/AppText';

interface CheckinButtonProps {
  status: SafetyStatus;
  disabled?: boolean;
  onPress: () => void;
}

export function CheckinButton({ status, disabled = false, onPress }: CheckinButtonProps) {
  const pulse = useSharedValue(1);
  const shouldPulse = status === 'DUE_SOON' || status === 'OVERDUE';
  const accent = statusTheme[status].color;

  useEffect(() => {
    if (shouldPulse) {
      pulse.value = withRepeat(
        withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [pulse, shouldPulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: shouldPulse ? 0.35 : 0.18,
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.ring, { borderColor: accent }, ringStyle]} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Estou bem. Registrar check-in de segurança."
        accessibilityHint="Registra que você está bem e atualiza o próximo horário."
        disabled={disabled}
        onPress={() => {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onPress();
        }}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: status === 'ALERT_SENT' ? palette.crimson : palette.leaf },
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}>
        <Ionicons name="heart" size={34} color={palette.white} />
        <AppText variant="title" color={palette.white} centered>
          ESTOU BEM
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  ring: {
    position: 'absolute',
    width: 236,
    height: 236,
    borderRadius: 118,
    borderWidth: 16,
  },
  button: {
    width: 196,
    height: 196,
    borderRadius: 98,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 10px 16px rgba(10, 42, 31, 0.22)',
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.7,
  },
});

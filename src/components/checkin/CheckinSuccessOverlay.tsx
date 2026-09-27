import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { palette } from '@/constants/colors';

import { AppText } from '../ui/AppText';

interface CheckinSuccessOverlayProps {
  visible: boolean;
  message: string;
  nextCheckinLabel: string;
}

export function CheckinSuccessOverlay({
  visible,
  message,
  nextCheckinLabel,
}: CheckinSuccessOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <Animated.View entering={FadeIn.duration(180)} style={styles.card}>
          <Animated.View entering={ZoomIn.springify().damping(14)}>
            <View style={styles.iconWrap}>
              <Ionicons name="checkmark" size={36} color={palette.white} />
            </View>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(80)} style={styles.copy}>
            <AppText variant="title" centered>
              {message}
            </AppText>
            <AppText variant="body" color={palette.muted} centered>
              Próximo check-in: {nextCheckinLabel}.
            </AppText>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 42, 31, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    backgroundColor: palette.white,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 22,
    alignItems: 'center',
    gap: 16,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 8,
  },
});

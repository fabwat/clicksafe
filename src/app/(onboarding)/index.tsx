import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { palette } from '@/constants/colors';
import { appName, onboardingCopy } from '@/constants/copy';
import { useAppStore } from '@/store/appStore';

const icons = ['heart', 'people', 'cloud-offline'] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.mark}>
          <Ionicons name="shield-checkmark" size={32} color={palette.white} />
        </View>
        <AppText variant="label">{appName.toUpperCase()}</AppText>
        <AppText variant="display">{onboardingCopy.title}</AppText>
        <AppText variant="body" color={palette.muted}>
          {onboardingCopy.subtitle}
        </AppText>
      </View>

      <View style={styles.points}>
        {onboardingCopy.points.map((point, index) => (
          <View key={point.title} style={styles.point}>
            <View style={styles.pointIcon}>
              <Ionicons name={icons[index]} size={20} color={palette.leaf} />
            </View>
            <View style={styles.pointCopy}>
              <AppText variant="subtitle">{point.title}</AppText>
              <AppText variant="caption">{point.body}</AppText>
            </View>
          </View>
        ))}
      </View>

      <AppButton
        label={onboardingCopy.cta}
        onPress={() => {
          completeOnboarding();
          router.replace('/(app)/(tabs)');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 24,
    gap: 10,
    marginBottom: 28,
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  points: {
    gap: 16,
    marginBottom: 32,
  },
  point: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  pointIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: palette.leafSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointCopy: {
    flex: 1,
    gap: 4,
  },
});

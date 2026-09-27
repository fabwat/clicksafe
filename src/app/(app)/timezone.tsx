import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { palette } from '@/constants/colors';
import { COMMON_TIMEZONES } from '@/constants/config';
import { useAppStore } from '@/store/appStore';
import { getDeviceTimezone } from '@/utils/timezone';

export default function TimezoneScreen() {
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const deviceZone = getDeviceTimezone();
  const zones = Array.from(new Set([deviceZone, profile?.timezone ?? 'UTC', ...COMMON_TIMEZONES]));

  if (!profile) {
    return null;
  }

  return (
    <Screen>
      <AppText variant="caption" style={styles.lead}>
        Os prazos são calculados com a timezone que você escolher, neste aparelho.
      </AppText>
      <View style={styles.list}>
        {zones.map((zone) => {
          const selected = zone === profile.timezone;
          return (
            <Pressable
              key={zone}
              onPress={() => updateProfile({ timezone: zone })}
              style={[styles.item, selected && styles.selected]}>
              <AppText variant="subtitle" color={selected ? palette.forest : palette.ink}>
                {zone}
              </AppText>
              {zone === deviceZone ? (
                <AppText variant="caption">Detectada neste aparelho</AppText>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginBottom: 16,
  },
  list: {
    gap: 10,
  },
  item: {
    backgroundColor: palette.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 14,
    gap: 4,
  },
  selected: {
    borderColor: palette.leaf,
    backgroundColor: palette.leafSoft,
  },
});

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { FormField } from '@/components/ui/FormField';
import { Screen } from '@/components/ui/Screen';
import { palette } from '@/constants/colors';
import { FREQUENCY_OPTIONS } from '@/constants/config';
import { useAppStore } from '@/store/appStore';
import type { FrequencyType } from '@/types';

export default function CheckinSettingsScreen() {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(settings?.frequencyType ?? 'daily');
  const [frequencyValue, setFrequencyValue] = useState(String(settings?.frequencyValue ?? 1));
  const [checkinTime, setCheckinTime] = useState(settings?.checkinTime ?? '20:00');
  const [gracePeriod, setGracePeriod] = useState(String(settings?.gracePeriodMinutes ?? 30));
  const [reminder, setReminder] = useState(String(settings?.reminderMinutes ?? 30));
  const [saved, setSaved] = useState(false);

  if (!settings) {
    return null;
  }

  function selectPreset(type: FrequencyType, value: number, time: string | null) {
    setFrequencyType(type);
    setFrequencyValue(String(value));
    if (time) {
      setCheckinTime(time);
    }
    setSaved(false);
  }

  function handleSave() {
    const value = Number(frequencyValue);
    const grace = Number(gracePeriod);
    const reminderMinutes = Number(reminder);

    if (!Number.isFinite(value) || value < 1) {
      return;
    }
    if (!Number.isFinite(grace) || grace < 0) {
      return;
    }
    if (!Number.isFinite(reminderMinutes) || reminderMinutes < 0) {
      return;
    }

    const usesTime = frequencyType === 'daily' || frequencyType === 'specific_time';
    updateSettings({
      frequencyType,
      frequencyValue: value,
      checkinTime: usesTime ? checkinTime : null,
      gracePeriodMinutes: grace,
      reminderMinutes,
    });
    setSaved(true);
  }

  return (
    <Screen>
      <AppText variant="caption" style={styles.lead}>
        Frequência, horário, lembrete e tolerância. O próximo prazo é recalculado ao salvar.
      </AppText>

      <View style={styles.section}>
        <AppText variant="label">FREQUÊNCIA</AppText>
        {FREQUENCY_OPTIONS.map((option) => {
          const isCurrentFamily = option.type === frequencyType && option.value === Number(frequencyValue);

          return (
            <Pressable
              key={`${option.type}-${option.value}-${option.label}`}
              onPress={() => selectPreset(option.type, option.value, option.time)}
              style={[styles.option, isCurrentFamily && styles.optionSelected]}>
              <AppText variant="subtitle" color={isCurrentFamily ? palette.forest : palette.ink}>
                {option.label}
              </AppText>
              <AppText variant="caption">{option.helper}</AppText>
            </Pressable>
          );
        })}
      </View>

      {(frequencyType === 'daily' || frequencyType === 'specific_time') && (
        <FormField
          label="Horário"
          value={checkinTime}
          onChangeText={setCheckinTime}
          placeholder="20:00"
        />
      )}

      {frequencyType === 'custom' && (
        <FormField
          label="Intervalo personalizado (horas)"
          keyboardType="number-pad"
          value={frequencyValue}
          onChangeText={setFrequencyValue}
        />
      )}

      <FormField
        label="Lembrete (minutos antes)"
        keyboardType="number-pad"
        value={reminder}
        onChangeText={setReminder}
      />
      <FormField
        label="Tolerância / grace period (minutos)"
        keyboardType="number-pad"
        value={gracePeriod}
        onChangeText={setGracePeriod}
      />

      {saved ? (
        <AppText variant="caption" color={palette.leaf}>
          Configuração salva. O próximo check-in foi recalculado.
        </AppText>
      ) : null}

      <AppButton label="Salvar configuração" onPress={handleSave} style={styles.save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginBottom: 18,
  },
  section: {
    gap: 10,
    marginBottom: 16,
  },
  option: {
    backgroundColor: palette.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 14,
    gap: 4,
  },
  optionSelected: {
    borderColor: palette.leaf,
    backgroundColor: palette.leafSoft,
  },
  save: {
    marginTop: 10,
  },
});

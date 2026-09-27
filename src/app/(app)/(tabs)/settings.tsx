import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { FREQUENCY_OPTIONS } from '@/constants/config';
import { SettingsRow } from '@/features/settings/SettingsRow';
import { useAppStore } from '@/store/appStore';
import { formatPhoneDisplay } from '@/utils/phone';

export default function SettingsScreen() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const settings = useAppStore((state) => state.settings);
  const contact = useAppStore((state) => state.contacts[0] ?? null);
  const resetLocalData = useAppStore((state) => state.resetLocalData);

  if (!profile || !settings) {
    return null;
  }

  const frequencyLabel =
    FREQUENCY_OPTIONS.find(
      (option) =>
        option.type === settings.frequencyType &&
        option.value === settings.frequencyValue &&
        option.time === settings.checkinTime,
    )?.label ?? 'Personalizada';

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Configurações</AppText>
        <AppText variant="caption">Perfil, prazos, contato e preferências.</AppText>
      </View>

      <Card>
        <SettingsRow
          icon="person"
          title="Perfil"
          value={profile.name}
          onPress={() => router.push('/(app)/profile')}
        />
        <SettingsRow
          icon="time"
          title="Check-in"
          value={`${frequencyLabel}${settings.checkinTime ? ` · ${settings.checkinTime}` : ''}`}
          onPress={() => router.push('/(app)/checkin-settings')}
        />
        <SettingsRow
          icon="call"
          title="Contato de emergência"
          value={contact ? `${contact.name} · ${formatPhoneDisplay(contact.countryCode, contact.phone)}` : 'Não cadastrado'}
          onPress={() => router.push('/(app)/contact')}
        />
        <SettingsRow
          icon="notifications"
          title="Método de notificação"
          value={contact?.notificationMethod === 'sms' ? 'SMS' : 'WhatsApp'}
          onPress={() => router.push('/(app)/notification-method')}
        />
        <SettingsRow
          icon="chatbox-ellipses"
          title="Mensagem de emergência"
          onPress={() => router.push('/(app)/emergency-message')}
        />
        <SettingsRow
          icon="globe"
          title="Timezone"
          value={profile.timezone}
          onPress={() => router.push('/(app)/timezone')}
        />
      </Card>

      <Card style={styles.block}>
        <SettingsRow
          icon="trash"
          title="Apagar dados locais"
          destructive
          onPress={() => {
            Alert.alert(
              'Apagar dados',
              'Isso restaura o perfil, o contato e o histórico na memória do app.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Apagar',
                  style: 'destructive',
                  onPress: resetLocalData,
                },
              ],
            );
          }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    marginBottom: 18,
    gap: 6,
  },
  block: {
    marginTop: 14,
  },
});

import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useAppStore } from '@/store/appStore';
import type { NotificationMethod } from '@/types';

export default function NotificationMethodScreen() {
  const contact = useAppStore((state) => state.contacts[0] ?? null);
  const upsertPrimaryContact = useAppStore((state) => state.upsertPrimaryContact);

  function choose(method: NotificationMethod) {
    if (!contact) {
      return;
    }
    upsertPrimaryContact({
      name: contact.name,
      phone: contact.phone,
      countryCode: contact.countryCode,
      relationship: contact.relationship,
      notificationMethod: method,
    });
  }

  return (
    <Screen>
      <AppText variant="caption" style={styles.lead}>
        A preferência fica salva neste aparelho. A mensagem de teste abre o WhatsApp ou o SMS para você confirmar o envio.
      </AppText>

      <Card>
        <AppText variant="label">MÉTODO PREFERIDO</AppText>
        <View style={styles.methods}>
          <AppButton
            label={contact?.notificationMethod === 'whatsapp' ? 'WhatsApp (selecionado)' : 'WhatsApp'}
            variant={contact?.notificationMethod === 'whatsapp' ? 'primary' : 'secondary'}
            onPress={() => choose('whatsapp')}
          />
          <AppButton
            label={contact?.notificationMethod === 'sms' ? 'SMS (selecionado)' : 'SMS'}
            variant={contact?.notificationMethod === 'sms' ? 'primary' : 'secondary'}
            onPress={() => choose('sms')}
          />
        </View>
        <AppText variant="caption">E-mail será adicionado em uma versão futura.</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginBottom: 18,
  },
  methods: {
    gap: 10,
    marginVertical: 12,
  },
});

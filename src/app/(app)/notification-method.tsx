import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Screen } from '@/components/ui/Screen';
import { palette } from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import type { NotificationMethod } from '@/types';

export default function NotificationMethodScreen() {
  const contact = useAppStore((state) => state.contacts[0] ?? null);
  const upsertPrimaryContact = useAppStore((state) => state.upsertPrimaryContact);
  const whatsappCloud = useAppStore((state) => state.whatsappCloud);
  const smsGateway = useAppStore((state) => state.smsGateway);
  const updateWhatsAppCloud = useAppStore((state) => state.updateWhatsAppCloud);
  const updateSmsGateway = useAppStore((state) => state.updateSmsGateway);
  const [accessToken, setAccessToken] = useState(whatsappCloud.accessToken);
  const [phoneNumberId, setPhoneNumberId] = useState(whatsappCloud.phoneNumberId);
  const [templateName, setTemplateName] = useState(whatsappCloud.templateName);
  const [accountSid, setAccountSid] = useState(smsGateway.accountSid);
  const [smsToken, setSmsToken] = useState(smsGateway.authToken);
  const [fromNumber, setFromNumber] = useState(smsGateway.fromNumber);
  const [savedConfig, setSavedConfig] = useState(false);
  const [savedSms, setSavedSms] = useState(false);

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

  function saveCloudConfig() {
    updateWhatsAppCloud({
      accessToken,
      phoneNumberId,
      templateName,
    });
    setSavedConfig(true);
  }

  function saveSmsConfig() {
    updateSmsGateway({
      accountSid,
      authToken: smsToken,
      fromNumber,
    });
    setSavedSms(true);
  }

  return (
    <Screen>
      <AppText variant="caption" style={styles.lead}>
        O alerta sai sozinho pelo método escolhido. O app não abre outro aplicativo nem pede confirmação.
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
      </Card>

      <Card style={styles.block}>
        <AppText variant="label">API DO WHATSAPP</AppText>
        <FormField
          label="Token de acesso"
          value={accessToken}
          onChangeText={(value) => {
            setAccessToken(value);
            setSavedConfig(false);
          }}
          placeholder="Token da API"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormField
          label="ID do número"
          value={phoneNumberId}
          onChangeText={(value) => {
            setPhoneNumberId(value);
            setSavedConfig(false);
          }}
          placeholder="Phone number ID"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormField
          label="Modelo (opcional)"
          value={templateName}
          onChangeText={(value) => {
            setTemplateName(value);
            setSavedConfig(false);
          }}
          placeholder="Nome do template aprovado"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {savedConfig ? (
          <AppText variant="caption" color={palette.leaf}>
            Credenciais salvas nesta sessão.
          </AppText>
        ) : null}
        <AppButton label="Salvar API" onPress={saveCloudConfig} />
      </Card>

      <Card style={styles.block}>
        <AppText variant="label">SMS AUTOMÁTICO</AppText>
        <FormField
          label="Conta Twilio"
          value={accountSid}
          onChangeText={(value) => {
            setAccountSid(value);
            setSavedSms(false);
          }}
          placeholder="Account SID"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormField
          label="Token Twilio"
          value={smsToken}
          onChangeText={(value) => {
            setSmsToken(value);
            setSavedSms(false);
          }}
          placeholder="Auth token"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormField
          label="Número de origem"
          value={fromNumber}
          onChangeText={(value) => {
            setFromNumber(value);
            setSavedSms(false);
          }}
          placeholder="+5511999999999"
          keyboardType="phone-pad"
        />
        {savedSms ? (
          <AppText variant="caption" color={palette.leaf}>
            Credenciais de SMS salvas nesta sessão.
          </AppText>
        ) : null}
        <AppButton label="Salvar SMS" onPress={saveSmsConfig} />
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
  block: {
    marginTop: 16,
    gap: 12,
  },
});

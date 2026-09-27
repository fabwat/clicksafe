import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { FormField } from '@/components/ui/FormField';
import { Screen } from '@/components/ui/Screen';
import { palette } from '@/constants/colors';
import { deliverToSavedContact } from '@/features/alerts/deliverContactMessage';
import { useAppStore } from '@/store/appStore';
import type { NotificationMethod } from '@/types';
import { isValidPhone } from '@/utils/phone';

export default function ContactScreen() {
  const existing = useAppStore((state) => state.contacts[0] ?? null);
  const upsertPrimaryContact = useAppStore((state) => state.upsertPrimaryContact);
  const [name, setName] = useState(existing?.name ?? '');
  const [relationship, setRelationship] = useState(existing?.relationship ?? '');
  const [countryCode, setCountryCode] = useState(existing?.countryCode ?? '+55');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [method, setMethod] = useState<NotificationMethod>(existing?.notificationMethod ?? 'whatsapp');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function persistContact(): boolean {
    if (name.trim().length < 2) {
      setError('Informe o nome do contato.');
      setSaved(false);
      return false;
    }
    if (!isValidPhone(countryCode, phone)) {
      setError('Telefone inválido. Use código do país e número com DDD.');
      setSaved(false);
      return false;
    }

    upsertPrimaryContact({
      name: name.trim(),
      relationship: relationship.trim() || 'Contato',
      countryCode,
      phone,
      notificationMethod: method,
    });
    setError(null);
    setSaved(true);
    return true;
  }

  function handleSave() {
    persistContact();
  }

  async function handleTest() {
    if (!persistContact()) {
      return;
    }

    setNotice(null);

    try {
      const result = await deliverToSavedContact('test');
      const channel = result.method === 'whatsapp' ? 'WhatsApp' : 'SMS';
      const message = `Mensagem enviada para ${result.contactName} por ${channel}, sem abrir outro aplicativo.`;
      setError(null);
      setNotice(message);
      Alert.alert('Mensagem de teste', `${message}\n\n${result.preview}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado.';
      setNotice(null);
      setError(message);
      Alert.alert('Não foi possível testar', message);
    }
  }

  return (
    <Screen>
      <AppText variant="caption" style={styles.lead}>
        O app guarda só um contato principal, na memória.
      </AppText>

      <View style={styles.form}>
        <FormField label="Nome" value={name} onChangeText={setName} placeholder="Nome do contato" />
        <FormField
          label="Relacionamento"
          value={relationship}
          onChangeText={setRelationship}
          placeholder="Ex.: mãe, amigo"
        />
        <FormField label="Código do país" value={countryCode} onChangeText={setCountryCode} placeholder="+55" />
        <FormField
          label="Telefone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholder="11999999999"
        />

        <AppText variant="label">MÉTODO PREFERIDO</AppText>
        <View style={styles.methods}>
          {(['whatsapp', 'sms'] as const).map((item) => (
            <AppButton
              key={item}
              label={item === 'whatsapp' ? 'WhatsApp' : 'SMS'}
              variant={method === item ? 'primary' : 'secondary'}
              onPress={() => setMethod(item)}
              style={styles.method}
            />
          ))}
        </View>

        {error ? (
          <AppText variant="caption" color={palette.crimson}>
            {error}
          </AppText>
        ) : null}
        {saved ? (
          <AppText variant="caption" color={palette.leaf}>
            Contato salvo neste aparelho.
          </AppText>
        ) : null}
        {notice ? (
          <AppText variant="caption" color={palette.leaf}>
            {notice}
          </AppText>
        ) : null}

        <AppButton label="Salvar contato" onPress={handleSave} />
        <AppButton label="Enviar mensagem de teste" variant="secondary" onPress={handleTest} />
        <AppText variant="caption">
          A mensagem de teste sai pelo mesmo envio automático do alerta.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginBottom: 18,
  },
  form: {
    gap: 14,
  },
  methods: {
    flexDirection: 'row',
    gap: 10,
  },
  method: {
    flex: 1,
  },
});

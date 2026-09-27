import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Screen } from '@/components/ui/Screen';
import { DEFAULT_EMERGENCY_MESSAGE } from '@/constants/config';
import { palette } from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { renderEmergencyMessage } from '@/utils/message';

export default function EmergencyMessageScreen() {
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [message, setMessage] = useState(profile?.emergencyMessage ?? DEFAULT_EMERGENCY_MESSAGE);
  const [saved, setSaved] = useState(false);

  if (!profile) {
    return null;
  }

  return (
    <Screen>
      <View style={styles.form}>
        <AppText variant="caption">
          Use [NOME] para inserir o nome do perfil. A mensagem fica salva neste aparelho.
        </AppText>
        <FormField
          label="Mensagem"
          value={message}
          onChangeText={setMessage}
          multiline
          style={styles.area}
        />
        <Card>
          <AppText variant="label">PRÉVIA</AppText>
          <AppText variant="body">{renderEmergencyMessage(message, profile.name)}</AppText>
        </Card>
        {saved ? (
          <AppText variant="caption" color={palette.leaf}>
            Mensagem salva.
          </AppText>
        ) : null}
        <AppButton
          label="Salvar mensagem"
          onPress={() => {
            updateProfile({ emergencyMessage: message.trim() || DEFAULT_EMERGENCY_MESSAGE });
            setSaved(true);
          }}
        />
        <AppButton
          label="Restaurar padrão"
          variant="secondary"
          onPress={() => {
            setMessage(DEFAULT_EMERGENCY_MESSAGE);
            setSaved(false);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
  area: {
    minHeight: 140,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});

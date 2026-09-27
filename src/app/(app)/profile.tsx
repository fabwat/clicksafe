import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { FormField } from '@/components/ui/FormField';
import { Screen } from '@/components/ui/Screen';
import { palette } from '@/constants/colors';
import { useAppStore } from '@/store/appStore';

export default function ProfileScreen() {
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [name, setName] = useState(profile?.name ?? '');
  const [saved, setSaved] = useState(false);

  if (!profile) {
    return null;
  }

  return (
    <Screen>
      <View style={styles.form}>
        <FormField label="Nome" value={name} onChangeText={setName} />
        {saved ? (
          <AppText variant="caption" color={palette.leaf}>
            Perfil atualizado.
          </AppText>
        ) : null}
        <AppButton
          label="Salvar perfil"
          onPress={() => {
            if (name.trim().length < 2) {
              return;
            }
            updateProfile({ name: name.trim() });
            setSaved(true);
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
});

import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { palette } from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Não encontrado', headerShown: true }} />
      <View style={styles.container}>
        <AppText variant="title">Esta tela não existe.</AppText>
        <Link href="/" style={styles.link}>
          <AppText variant="subtitle" color={palette.leaf}>
            Voltar ao início
          </AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: palette.cream,
    gap: 12,
  },
  link: {
    paddingVertical: 12,
  },
});

import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">{title}</AppText>
      {description ? <AppText variant="caption">{description}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
    marginBottom: 8,
  },
});

import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { palette } from '@/constants/colors';

import { AppText } from './AppText';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({ label, error, style, ...props }: FormFieldProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label">{label.toUpperCase()}</AppText>
      <TextInput
        placeholderTextColor={palette.muted}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? (
        <AppText variant="caption" color={palette.crimson}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
    paddingHorizontal: 14,
    fontSize: 16,
    color: palette.ink,
  },
  inputError: {
    borderColor: palette.crimson,
  },
});

import { Text, type TextProps, type TextStyle } from 'react-native';

import { palette } from '@/constants/colors';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';

const variantStyles: Record<Variant, TextStyle> = {
  display: { fontSize: 30, fontWeight: '700', color: palette.ink, letterSpacing: -0.6 },
  title: { fontSize: 22, fontWeight: '700', color: palette.ink, letterSpacing: -0.3 },
  subtitle: { fontSize: 17, fontWeight: '600', color: palette.ink },
  body: { fontSize: 16, fontWeight: '400', color: palette.ink, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '500', color: palette.muted, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: '700', color: palette.muted, letterSpacing: 0.3 },
};

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  centered?: boolean;
}

export function AppText({ variant = 'body', color, centered, style, ...props }: AppTextProps) {
  return (
    <Text
      style={[variantStyles[variant], color ? { color } : null, centered ? { textAlign: 'center' } : null, style]}
      {...props}
    />
  );
}

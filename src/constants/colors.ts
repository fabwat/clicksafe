import type { SafetyStatus } from '@/types';

export const palette = {
  forest: '#0F3D2E',
  forestDeep: '#0A2A1F',
  leaf: '#1B7A4E',
  leafSoft: '#E4F4EC',
  cream: '#F3F6F4',
  white: '#FFFFFF',
  ink: '#15241E',
  muted: '#5C6F67',
  line: '#D7E0DB',
  amber: '#C47B17',
  amberSoft: '#FFF4E0',
  orange: '#C2410C',
  orangeSoft: '#FFE8DC',
  crimson: '#B91C1C',
  crimsonSoft: '#FDECEC',
  danger: '#9F1239',
} as const;

export const statusTheme: Record<
  SafetyStatus,
  {
    label: string;
    description: string;
    icon: 'checkmark-circle' | 'time' | 'warning' | 'alert-circle';
    color: string;
    background: string;
  }
> = {
  SAFE: {
    label: 'Tudo certo',
    description: 'Seu check-in está em dia.',
    icon: 'checkmark-circle',
    color: palette.leaf,
    background: palette.leafSoft,
  },
  DUE_SOON: {
    label: 'Check-in próximo do vencimento',
    description: 'Faça seu check-in em breve.',
    icon: 'time',
    color: palette.amber,
    background: palette.amberSoft,
  },
  OVERDUE: {
    label: 'Check-in atrasado',
    description: 'Confirme agora para evitar o alerta.',
    icon: 'warning',
    color: palette.orange,
    background: palette.orangeSoft,
  },
  ALERT_SENT: {
    label: 'Alerta enviado',
    description: 'Seu contato de emergência já foi avisado.',
    icon: 'alert-circle',
    color: palette.crimson,
    background: palette.crimsonSoft,
  },
};

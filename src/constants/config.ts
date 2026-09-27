export const CHECKIN_DEBOUNCE_MS = 60_000;

export const DEFAULT_GRACE_PERIOD_MINUTES = 30;
export const DEFAULT_REMINDER_MINUTES = 30;
export const DEFAULT_CHECKIN_TIME = '20:00';

export const DEFAULT_EMERGENCY_MESSAGE =
  'Alerta de check-in: [NOME] não realizou o check-in dentro do horário esperado. Por favor, tente entrar em contato.';

export const TEST_MESSAGE =
  'Esta é uma mensagem de teste do aplicativo de check-in. Nenhuma emergência foi detectada.';

export const COMMON_TIMEZONES = [
  'America/Sao_Paulo',
  'America/Fortaleza',
  'America/Manaus',
  'America/Recife',
  'America/Belem',
  'America/Rio_Branco',
  'America/Noronha',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/Lisbon',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Tokyo',
  'UTC',
] as const;

export const FREQUENCY_OPTIONS: {
  type: 'daily' | 'every_n_hours' | 'every_n_days' | 'specific_time' | 'custom';
  label: string;
  helper: string;
  value: number;
  time: string | null;
}[] = [
  {
    type: 'daily',
    label: '1 vez por dia',
    helper: 'Todos os dias, no horário escolhido',
    value: 1,
    time: DEFAULT_CHECKIN_TIME,
  },
  {
    type: 'every_n_hours',
    label: 'A cada 12 horas',
    helper: 'A partir do último check-in',
    value: 12,
    time: null,
  },
  {
    type: 'every_n_hours',
    label: 'A cada 8 horas',
    helper: 'A partir do último check-in',
    value: 8,
    time: null,
  },
  {
    type: 'every_n_days',
    label: 'A cada 2 dias',
    helper: 'A partir do último check-in',
    value: 2,
    time: null,
  },
  {
    type: 'specific_time',
    label: 'Horário específico todos os dias',
    helper: 'Ex.: até 20:00 no seu fuso',
    value: 1,
    time: DEFAULT_CHECKIN_TIME,
  },
  {
    type: 'custom',
    label: 'Frequência personalizada',
    helper: 'Defina horas ou dias',
    value: 24,
    time: null,
  },
];

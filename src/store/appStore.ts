import { create } from 'zustand';

import { CHECKIN_DEBOUNCE_MS } from '@/constants/config';
import { createLocalWorkspace } from '@/store/seedData';
import type {
  Alert,
  Checkin,
  CheckinResult,
  CheckinSettings,
  EmergencyContact,
  HistoryEvent,
  Profile,
  SafetyStatus,
  Session,
  TestMessageResult,
  WhatsAppCloudConfig,
} from '@/types';
import { readWhatsAppCloudConfig } from '@/features/alerts/whatsappCloud';
import { formatNextCheckinLabel } from '@/utils/dates';
import { computeDeadlineFromSettings, getSafetyStatus } from '@/utils/deadlines';
import { createId } from '@/utils/id';
import { buildTestMessage } from '@/utils/message';
import { formatPhoneDisplay } from '@/utils/phone';

interface AppState {
  hasCompletedOnboarding: boolean;
  session: Session;
  profile: Profile;
  settings: CheckinSettings;
  contacts: EmergencyContact[];
  checkins: Checkin[];
  alerts: Alert[];
  history: HistoryEvent[];
  lastCheckinRequestAt: number | null;
  whatsappCloud: WhatsAppCloudConfig;
}

interface AppStore extends AppState {
  completeOnboarding: () => void;
  resetLocalData: () => void;
  performCheckin: (now?: Date) => CheckinResult;
  updateProfile: (patch: Partial<Pick<Profile, 'name' | 'timezone' | 'emergencyMessage'>>) => void;
  updateSettings: (
    patch: Partial<
      Pick<
        CheckinSettings,
        | 'frequencyType'
        | 'frequencyValue'
        | 'checkinTime'
        | 'gracePeriodMinutes'
        | 'reminderMinutes'
        | 'enabled'
      >
    >,
  ) => void;
  upsertPrimaryContact: (input: Omit<EmergencyContact, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'enabled'>) => void;
  updateWhatsAppCloud: (config: WhatsAppCloudConfig) => void;
  recordTestMessage: (providerMessageId: string) => TestMessageResult;
  recordEmergencyAlert: (input: {
    deadline: string;
    status: 'sent' | 'failed';
    errorMessage: string | null;
    providerMessageId?: string | null;
  }) => void;
}

const initialWorkspace = createLocalWorkspace();

export const useAppStore = create<AppStore>((set, get) => ({
  hasCompletedOnboarding: false,
  ...initialWorkspace,
  lastCheckinRequestAt: null,
  whatsappCloud: readWhatsAppCloudConfig(),

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  resetLocalData: () => {
    set({
      ...createLocalWorkspace(),
      lastCheckinRequestAt: null,
      whatsappCloud: readWhatsAppCloudConfig(),
    });
  },

  performCheckin: (now = new Date()) => {
    const state = get();
    const { session, profile, settings } = state;
    const lastCheckin = state.checkins[0] ?? null;

    if (state.lastCheckinRequestAt && now.getTime() - state.lastCheckinRequestAt < CHECKIN_DEBOUNCE_MS && lastCheckin) {
      return {
        created: false,
        checkedInAt: lastCheckin.checkedInAt,
        nextDeadlineAt: settings.nextDeadlineAt,
        message: 'Check-in já registrado.',
        nextCheckinLabel: formatNextCheckinLabel(settings.nextDeadlineAt, profile.timezone, now),
      };
    }

    const nextDeadline = computeDeadlineFromSettings(settings, profile.timezone, now, true);
    const checkin: Checkin = {
      id: createId('checkin'),
      userId: session.userId,
      checkedInAt: now.toISOString(),
      expectedDeadline: settings.nextDeadlineAt,
      createdAt: now.toISOString(),
    };
    const historyEvent: HistoryEvent = {
      id: createId('history'),
      userId: session.userId,
      type: 'checkin',
      occurredAt: now.toISOString(),
      title: 'Check-in realizado',
      description: 'Confirmação registrada com sucesso.',
    };

    set({
      lastCheckinRequestAt: now.getTime(),
      checkins: [checkin, ...state.checkins],
      settings: {
        ...settings,
        nextDeadlineAt: nextDeadline.toISOString(),
        updatedAt: now.toISOString(),
      },
      history: [historyEvent, ...state.history],
    });

    return {
      created: true,
      checkedInAt: checkin.checkedInAt,
      nextDeadlineAt: nextDeadline.toISOString(),
      message: 'Check-in realizado.',
      nextCheckinLabel: formatNextCheckinLabel(nextDeadline.toISOString(), profile.timezone, now),
    };
  },

  updateProfile: (patch) => {
    const { profile, settings } = get();
    const now = new Date();
    const nextProfile: Profile = {
      ...profile,
      ...patch,
      updatedAt: now.toISOString(),
    };

    const timezoneChanged = Boolean(patch.timezone && patch.timezone !== profile.timezone);
    const nextSettings = timezoneChanged
      ? {
          ...settings,
          nextDeadlineAt: computeDeadlineFromSettings(settings, nextProfile.timezone, now, false).toISOString(),
          updatedAt: now.toISOString(),
        }
      : settings;

    set({ profile: nextProfile, settings: nextSettings });
  },

  updateSettings: (patch) => {
    const { profile, settings } = get();
    const now = new Date();
    const merged: CheckinSettings = {
      ...settings,
      ...patch,
      updatedAt: now.toISOString(),
    };
    merged.nextDeadlineAt = computeDeadlineFromSettings(merged, profile.timezone, now, false).toISOString();
    set({ settings: merged });
  },

  upsertPrimaryContact: (input) => {
    const { session, contacts } = get();
    const now = new Date().toISOString();
    const existing = contacts[0];

    const contact: EmergencyContact = existing
      ? {
          ...existing,
          ...input,
          updatedAt: now,
        }
      : {
          id: createId('contact'),
          userId: session.userId,
          enabled: true,
          createdAt: now,
          updatedAt: now,
          ...input,
        };

    set({ contacts: [contact, ...contacts.filter((item) => item.id !== contact.id)] });
    const { maybeDeliverEmergencyAlert } = require('@/features/alerts/deliverContactMessage') as typeof import('@/features/alerts/deliverContactMessage');
    void maybeDeliverEmergencyAlert();
  },

  updateWhatsAppCloud: (config) => {
    set({
      whatsappCloud: {
        accessToken: config.accessToken.trim(),
        phoneNumberId: config.phoneNumberId.trim(),
        templateName: config.templateName.trim(),
      },
    });
  },

  recordTestMessage: (providerMessageId) => {
    const { session, profile, contacts, history } = get();
    const contact = contacts[0];
    if (!contact) {
      throw new Error('Cadastre um contato de emergência primeiro.');
    }

    const now = new Date();
    const preview = buildTestMessage(profile.emergencyMessage, profile.name);
    const historyEvent: HistoryEvent = {
      id: createId('history'),
      userId: session.userId,
      type: 'test_message',
      occurredAt: now.toISOString(),
      title: `Mensagem de teste para ${contact.name}`,
      description: deliveryDescription(contact),
    };

    set({ history: [historyEvent, ...history] });

    return {
      sent: true,
      method: contact.notificationMethod,
      preview,
      providerMessageId,
    };
  },

  recordEmergencyAlert: ({ deadline, status, errorMessage, providerMessageId = null }) => {
    const { session, contacts, alerts, history } = get();
    const contact = contacts[0] ?? null;
    const existing = alerts.find((alert) => alert.checkinDeadline === deadline);
    if (existing?.status === 'sent') {
      return;
    }

    const now = new Date().toISOString();
    const alert: Alert = {
      id: existing?.id ?? createId('alert'),
      userId: session.userId,
      checkinDeadline: deadline,
      emergencyContactId: contact?.id ?? existing?.emergencyContactId ?? 'missing',
      notificationMethod: contact?.notificationMethod ?? existing?.notificationMethod ?? 'whatsapp',
      status,
      providerMessageId,
      errorMessage,
      retryCount: existing ? existing.retryCount + 1 : 0,
      sentAt: status === 'sent' ? now : null,
      createdAt: existing?.createdAt ?? now,
    };
    const historyEvent: HistoryEvent = {
      id: createId('history'),
      userId: session.userId,
      type: status === 'sent' ? 'alert_sent' : 'alert_failed',
      occurredAt: now,
      title: status === 'sent' && contact ? `Alerta para ${contact.name}` : 'Alerta não enviado',
      description:
        status === 'sent' && contact
          ? deliveryDescription(contact)
          : (errorMessage ?? 'Não foi possível avisar o contato.'),
    };

    set({
      alerts: existing
        ? alerts.map((item) => (item.id === existing.id ? alert : item))
        : [alert, ...alerts],
      history: [historyEvent, ...history],
    });
  },
}));

function deliveryDescription(contact: EmergencyContact): string {
  const channel = contact.notificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS';
  return `${channel} enviado para ${formatPhoneDisplay(contact.countryCode, contact.phone)}.`;
}

export function selectSafetyStatus(state: AppStore, now = new Date()): SafetyStatus {
  const alertSent = state.alerts.some(
    (alert) => alert.checkinDeadline === state.settings.nextDeadlineAt && alert.status === 'sent',
  );

  return getSafetyStatus({
    nowUtc: now,
    deadlineUtc: new Date(state.settings.nextDeadlineAt),
    gracePeriodMinutes: state.settings.gracePeriodMinutes,
    reminderMinutes: state.settings.reminderMinutes,
    alertSent,
  });
}

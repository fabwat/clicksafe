import { useAppStore } from '@/store/appStore';
import type { NotificationMethod } from '@/types';
import { isAlertDue } from '@/utils/deadlines';
import { buildTestMessage, renderEmergencyMessage } from '@/utils/message';
import { openOutboundMessage } from '@/utils/outbound';

export const MISSING_CONTACT_ERROR = 'Cadastre um contato de emergência para enviar o alerta.';

export type DeliveryPurpose = 'test' | 'alert';

export interface DeliveryResult {
  sent: boolean;
  method: NotificationMethod;
  preview: string;
  contactName: string;
}

let inflightDeadline: string | null = null;

export async function deliverToSavedContact(purpose: DeliveryPurpose): Promise<DeliveryResult> {
  const state = useAppStore.getState();
  const contact = state.contacts[0];
  if (!contact || !contact.enabled) {
    throw new Error('Cadastre um contato de emergência primeiro.');
  }

  const deadline = state.settings.nextDeadlineAt;
  const preview =
    purpose === 'test'
      ? buildTestMessage(state.profile.emergencyMessage, state.profile.name)
      : renderEmergencyMessage(state.profile.emergencyMessage, state.profile.name);

  await openOutboundMessage({
    method: contact.notificationMethod,
    countryCode: contact.countryCode,
    phone: contact.phone,
    text: preview,
  });

  if (purpose === 'test') {
    useAppStore.getState().recordTestMessage();
  } else {
    useAppStore.getState().recordEmergencyAlert({ deadline, status: 'sent', errorMessage: null });
  }

  return {
    sent: true,
    method: contact.notificationMethod,
    preview,
    contactName: contact.name,
  };
}

export async function maybeDeliverEmergencyAlert(now = new Date()): Promise<void> {
  const state = useAppStore.getState();
  if (!state.hasCompletedOnboarding || !state.settings.enabled) {
    return;
  }

  const deadline = state.settings.nextDeadlineAt;
  if (
    !isAlertDue({
      nowUtc: now,
      deadlineUtc: new Date(deadline),
      gracePeriodMinutes: state.settings.gracePeriodMinutes,
    })
  ) {
    return;
  }

  const existing = state.alerts.find((alert) => alert.checkinDeadline === deadline);
  if (existing?.status === 'sent') {
    return;
  }
  if (existing?.status === 'failed' && existing.errorMessage !== MISSING_CONTACT_ERROR) {
    return;
  }

  const contact = state.contacts[0];
  if (!contact || !contact.enabled) {
    if (existing?.errorMessage === MISSING_CONTACT_ERROR) {
      return;
    }
    useAppStore.getState().recordEmergencyAlert({
      deadline,
      status: 'failed',
      errorMessage: MISSING_CONTACT_ERROR,
    });
    return;
  }

  if (inflightDeadline === deadline) {
    return;
  }
  inflightDeadline = deadline;

  try {
    await deliverToSavedContact('alert');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível abrir o aplicativo.';
    const current = useAppStore.getState().alerts.find((alert) => alert.checkinDeadline === deadline);
    if (current?.status !== 'sent') {
      useAppStore.getState().recordEmergencyAlert({
        deadline,
        status: 'failed',
        errorMessage: message,
      });
    }
  } finally {
    if (inflightDeadline === deadline) {
      inflightDeadline = null;
    }
  }
}

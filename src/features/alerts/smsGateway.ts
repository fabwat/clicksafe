import type { SmsGatewayConfig } from '@/types';

export interface SmsSendRequest {
  config: SmsGatewayConfig;
  to: string;
  body: string;
}

interface TwilioMessageResponse {
  sid?: string;
  message?: string;
}

export function readSmsGatewayConfig(): SmsGatewayConfig {
  const env = process.env as Record<string, string | undefined>;
  return {
    accountSid: env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID?.trim() ?? '',
    authToken: env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN?.trim() ?? '',
    fromNumber: env.EXPO_PUBLIC_TWILIO_FROM_NUMBER?.trim() ?? '',
  };
}

export function buildSmsForm({ config, to, body }: SmsSendRequest): URLSearchParams {
  return new URLSearchParams({
    To: to,
    From: normalizeSmsFrom(config.fromNumber),
    Body: body,
  });
}

function normalizeSmsFrom(value: string): string {
  return `+${value.replace(/\D/g, '')}`;
}

export async function sendSmsMessage(request: SmsSendRequest, fetchImpl: typeof fetch = fetch): Promise<string> {
  const accountSid = request.config.accountSid.trim();
  const authToken = request.config.authToken.trim();
  const fromNumber = request.config.fromNumber.trim();
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error(
      'Para o SMS sair sozinho, informe a conta, o token e o número de origem em Método de notificação.',
    );
  }

  const response = await fetchImpl(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${globalThis.btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: buildSmsForm(request).toString(),
  });

  const payload = (await response.json().catch(() => null)) as TwilioMessageResponse | null;
  if (!response.ok) {
    throw new Error(payload?.message ?? 'O serviço de SMS recusou o envio.');
  }

  if (!payload?.sid) {
    throw new Error('O serviço de SMS não confirmou o envio.');
  }

  return payload.sid;
}

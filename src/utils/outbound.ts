import { Linking, Platform } from 'react-native';

import type { NotificationMethod } from '@/types';
import { toE164 } from '@/utils/phone';

interface OutboundMessage {
  method: NotificationMethod;
  countryCode: string;
  phone: string;
  text: string;
}

export function buildOutboundUrl({ method, countryCode, phone, text }: OutboundMessage): string {
  const e164 = toE164(countryCode, phone);
  const encoded = encodeURIComponent(text);

  if (method === 'whatsapp') {
    return `https://wa.me/${e164.slice(1)}?text=${encoded}`;
  }

  const separator = Platform.OS === 'ios' ? '&' : '?';
  return `sms:${e164}${separator}body=${encoded}`;
}

export async function openOutboundMessage(message: OutboundMessage): Promise<void> {
  const url = buildOutboundUrl(message);
  try {
    await Linking.openURL(url);
  } catch {
    const channel = message.method === 'whatsapp' ? 'o WhatsApp' : 'o SMS';
    throw new Error(`Não foi possível abrir ${channel}. Verifique se o aplicativo está instalado.`);
  }
}

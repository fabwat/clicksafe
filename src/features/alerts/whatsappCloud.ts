import type { WhatsAppCloudConfig } from '@/types';

const GRAPH_VERSION = 'v21.0';

export interface WhatsAppSendRequest {
  config: WhatsAppCloudConfig;
  to: string;
  body: string;
}

interface WhatsAppApiResponse {
  messages?: { id?: string }[];
  error?: { message?: string };
}

export function readWhatsAppCloudConfig(): WhatsAppCloudConfig {
  const env = process.env as Record<string, string | undefined>;
  return {
    accessToken: env.EXPO_PUBLIC_WHATSAPP_TOKEN?.trim() ?? '',
    phoneNumberId: env.EXPO_PUBLIC_WHATSAPP_PHONE_NUMBER_ID?.trim() ?? '',
    templateName: env.EXPO_PUBLIC_WHATSAPP_TEMPLATE?.trim() ?? '',
  };
}

export function buildWhatsAppPayload({ config, to, body }: WhatsAppSendRequest) {
  const recipient = to.replace(/\D/g, '');
  const templateName = config.templateName.trim();

  if (templateName) {
    return {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'pt_BR' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: body }],
          },
        ],
      },
    };
  }

  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: 'text',
    text: {
      preview_url: false,
      body,
    },
  };
}

export async function sendWhatsAppCloudMessage(request: WhatsAppSendRequest, fetchImpl: typeof fetch = fetch): Promise<string> {
  const accessToken = request.config.accessToken.trim();
  const phoneNumberId = request.config.phoneNumberId.trim();
  if (!accessToken || !phoneNumberId) {
    throw new Error(
      'Para o alerta sair sozinho, informe o token e o ID do número da API do WhatsApp em Método de notificação.',
    );
  }

  const response = await fetchImpl(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildWhatsAppPayload(request)),
  });

  const payload = (await response.json().catch(() => null)) as WhatsAppApiResponse | null;
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'A API do WhatsApp recusou o envio.');
  }

  const providerMessageId = payload?.messages?.[0]?.id;
  if (!providerMessageId) {
    throw new Error('A API do WhatsApp não confirmou o envio.');
  }

  return providerMessageId;
}

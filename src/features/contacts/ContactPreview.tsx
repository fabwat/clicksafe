import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import type { EmergencyContact } from '@/types';
import { formatPhoneDisplay } from '@/utils/phone';

interface ContactPreviewProps {
  contact: EmergencyContact | null;
}

export function ContactPreview({ contact }: ContactPreviewProps) {
  return (
    <Card>
      <AppText variant="label">CONTATO DE EMERGÊNCIA</AppText>
      {contact ? (
        <>
          <AppText variant="subtitle">
            {contact.name} · {contact.relationship}
          </AppText>
          <AppText variant="caption">
            {formatPhoneDisplay(contact.countryCode, contact.phone)} ·{' '}
            {contact.notificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
          </AppText>
        </>
      ) : (
        <AppText variant="caption">Cadastre alguém de confiança para ser avisado.</AppText>
      )}
    </Card>
  );
}

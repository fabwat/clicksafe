# ClickSafe

Check-in de segurança para iOS e Android. Tudo roda no próprio app, em memória. Sem login. Quando o prazo e a tolerância passam com o app aberto, o alerta é enviado sozinho pela API do WhatsApp para o contato salvo. A mensagem de teste usa o mesmo envio. O app não abre o WhatsApp.

Em **Método de notificação**, informe o token e o ID do número da WhatsApp Cloud API. Se a conversa ainda não foi iniciada pelo contato, use um template aprovado no campo de modelo. Também é possível definir `EXPO_PUBLIC_WHATSAPP_TOKEN`, `EXPO_PUBLIC_WHATSAPP_PHONE_NUMBER_ID` e `EXPO_PUBLIC_WHATSAPP_TEMPLATE`.

## Rodar

```bash
cd /home/fabiane/projects/react/clicksafe
npm install
npx expo start
```

- `a` — Android
- `i` — iOS
- `w` — web
- ou leia o QR Code no Expo Go

## Como testar

1. Onboarding → **Começar**
2. Na Home, pressione **ESTOU BEM**
3. Cadastre o contato de emergência e as preferências de check-in
4. Ao fechar o app, os dados zeram — estão só na memória da sessão

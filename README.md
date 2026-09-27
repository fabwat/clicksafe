# ClickSafe

Check-in de segurança para iOS e Android. Tudo roda no próprio app, em memória. Sem backend ou login. Quando o prazo e a tolerância passam com o app aberto, o alerta abre o WhatsApp ou o SMS do contato salvo. A mensagem de teste usa o mesmo envio.

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

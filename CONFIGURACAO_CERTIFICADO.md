# Configuração do Sistema de Envio de Certificados por Email

Este documento explica como configurar o sistema de envio de certificados por email usando EmailJS.

## Passo 1: Criar Conta no EmailJS

1. Acesse https://www.emailjs.com/
2. Crie uma conta gratuita
3. Faça login no dashboard

## Passo 2: Configurar Serviço de Email

1. No dashboard, vá em "Email Services"
2. Clique em "Add New Service"
3. Escolha um provedor (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta de email
5. Anote o **Service ID** gerado

## Passo 3: Criar Template de Email

1. Vá em "Email Templates"
2. Clique em "Create New Template"
3. Configure o template:
   - **From Name**: Simulador de Layouts
   - **Subject**: `{{subject}}`
   - **Content**: 
   ```html
   {{message_html}}
   ```
4. Ative a opção "HTML" se disponível
5. Clique em "Save"
6. Anote o **Template ID** gerado

## Passo 4: Obter Public Key

1. Vá em "Account" > "General"
2. Copie o **Public Key**

## Passo 5: Configurar no Código

Abra o arquivo `resultado.html` e substitua os seguintes valores na função `enviarCertificadoPorEmail`:

```javascript
// Linha ~315
emailjs.init("YOUR_PUBLIC_KEY"); // Substitua pelo Public Key

// Linha ~416
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
```

**Exemplo:**
```javascript
emailjs.init("abc123xyz456");

emailjs.send("service_gmail", "template_certificado", templateParams)
```

## Estrutura das Variáveis de Template

As seguintes variáveis são enviadas ao template:
- `to_email`: Email do destinatário
- `subject`: Assunto do email
- `message_html`: HTML completo do certificado

## Troubleshooting

### Erro: "Public key is required"
- Certifique-se de que a Public Key está correta
- Verifique se não há espaços extras

### Erro: "Service ID is invalid"
- Verifique se o Service ID está correto
- Certifique-se de que o serviço está ativo no dashboard

### Erro: "Template ID is invalid"
- Verifique se o Template ID está correto
- Certifique-se de que o template foi salvo corretamente

### Email não está sendo enviado
- Verifique os logs no console do navegador (F12)
- Verifique as configurações do provedor de email
- Certifique-se de que não excedeu o limite de emails grátis (200 emails/mês)

## Limites do Plano Gratuito

- 200 emails por mês
- EmailJS branding nos emails
- Suporte básico

Para remover as limitações, considere fazer upgrade para um plano pago.

## Testando

1. Acesse a página de resultado
2. Complete a avaliação com pontuação 100
3. O modal de certificado deve aparecer
4. Insira um email válido
5. Clique em "Enviar"
6. Verifique se recebeu o email

## Alternativas ao EmailJS

Se preferir outra solução, você pode:
- Usar Mailgun (requer backend)
- Usar SendGrid (requer backend)
- Criar seu próprio serviço de email
- Usar Web3.email (decentralizado)


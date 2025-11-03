// Função para enviar certificado por email
function enviarCertificadoPorEmail(email) {
  // Inicializa EmailJS
  emailjs.init("YOUR_PUBLIC_KEY"); // Substitua pela sua chave pública do EmailJS
  
  // Template HTML do certificado
  const certificadoHTML = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificado de Excelência</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .certificado {
          background: white;
          border: 10px solid gold;
          padding: 50px;
          max-width: 800px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
          color: #667eea;
          font-size: 2.5em;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .subtitle {
          font-size: 1.3em;
          color: #764ba2;
          margin-bottom: 30px;
        }
        .achievement {
          border: 2px solid #667eea;
          padding: 20px;
          margin: 20px 0;
          border-radius: 10px;
          background: #f8f9fa;
        }
        ul {
          list-style: none;
          padding: 0;
          text-align: left;
        }
        li {
          padding: 10px;
          margin: 5px 0;
          background: white;
          border-left: 4px solid gold;
          padding-left: 15px;
        }
        .date {
          margin-top: 30px;
          color: #666;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="certificado">
        <h1>🎉 Certificado de Excelência 🎉</h1>
        <p class="subtitle">Parabéns! Você atingiu 100/100 na avaliação!</p>
        
        <div class="achievement">
          <h2>Certificado de Nota 100</h2>
          <p>Este certificado comprova que você:</p>
          <ul>
            <li>✔ Selecionou os componentes ideais para a persona</li>
            <li>✔ Posicionou os componentes na ordem correta</li>
            <li>✔ Aplicou os temas apropriados</li>
            <li>✔ Criou um layout acessível e de qualidade</li>
          </ul>
        </div>
        
        <p class="date">Emitido em: ${new Date().toLocaleDateString('pt-BR')}</p>
        
        <p style="margin-top: 30px; font-size: 1.2em;">
          <strong>Simulador de Layouts</strong><br>
          Certificado de Excelência em Acessibilidade Web
        </p>
      </div>
    </body>
    </html>
  `;
  
  // Configuração do email
  const templateParams = {
    to_email: email,
    subject: '🎉 Seu Certificado de Excelência - Nota 100',
    message_html: certificadoHTML
  };
  
  // Envia o email
  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then(function(response) {
      alert(`✅ Certificado enviado com sucesso para ${email}!`);
      document.getElementById('certificado-email').value = '';
      document.getElementById('modal-certificado').querySelector('.btn-close').click();
    }, function(error) {
      console.error('Erro ao enviar email:', error);
      alert('⚠️ Erro ao enviar email. Por favor, tente novamente mais tarde.');
    });
}


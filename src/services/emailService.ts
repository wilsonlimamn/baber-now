import nodemailer from 'nodemailer';

export const SENDER_EMAIL = process.env.SMTP_USER || 'site3facil@gmail.com';
export const SENDER_NAME = 'Barber-Now Belém (3facil.com)';
export const SENDER_FULL = `"${SENDER_NAME}" <${SENDER_EMAIL}>`;

// Verifica se há senha de aplicativo SMTP configurada
const SMTP_PASSWORD = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || '';

// Cria o transporter do Nodemailer
export const createTransporter = () => {
  if (SMTP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });
  }

  // Se não houver senha no ambiente, cria um transporter com fallback transparente ou logging
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: SENDER_EMAIL,
      pass: 'not_configured',
    },
    // Em modo fallback para teste sem credenciais reais bloqueando o processo
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const isRealSmtpConfigured = (): boolean => {
  return Boolean(SMTP_PASSWORD && SMTP_PASSWORD.trim().length > 0);
};

// Layout HTML padrão com rodapé da 3facil.com
const wrapEmailTemplate = (title: string, bodyContent: string) => {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
      .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
      .header { background: #0f172a; padding: 28px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
      .header p { margin: 6px 0 0; color: #94a3b8; font-size: 13px; }
      .badge { display: inline-block; background: #2563eb; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; margin-top: 8px; }
      .content { padding: 32px 24px; }
      .info-box { background: #f1f5f9; border-left: 4px solid #2563eb; border-radius: 8px; padding: 16px; margin: 20px 0; }
      .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
      .footer { background: #0f172a; padding: 24px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #1e293b; }
      .footer a { color: #60a5fa; text-decoration: none; font-weight: 600; }
      .footer a:hover { text-decoration: underline; }
      .produced-by { margin-top: 12px; padding-top: 12px; border-top: 1px solid #334155; font-size: 13px; color: #cbd5e1; }
      .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div style="font-size: 28px; margin-bottom: 6px;">💈</div>
        <h1>Barber-Now Belém</h1>
        <p>Atendimento Profissional em Domicílio • Belém-PA</p>
        <span class="badge">E-mail Oficial via site3facil@gmail.com</span>
      </div>
      
      <div class="content">
        ${bodyContent}
      </div>

      <div class="footer">
        <p style="margin: 0 0 8px 0;">Este e-mail foi disparado automaticamente pelo sistema de agendamento <strong>Barber-Now</strong>.</p>
        <p style="margin: 0 0 8px 0;">Remetente Oficial: <strong>${SENDER_EMAIL}</strong></p>
        <div class="produced-by">
          Produzido com excelência por <a href="https://3facil.com" target="_blank" rel="noopener noreferrer">3facil.com</a>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Soluções Digitais & Sistemas Web • Belém-PA</div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

// 1. Envio de Confirmação de Pré-cadastro
export const sendRegistrationConfirmationEmail = async (params: {
  toEmail: string;
  name: string;
  role: 'client' | 'barber';
  password?: string;
  neighborhood?: string;
}) => {
  const { toEmail, name, role, password, neighborhood } = params;
  const isBarber = role === 'barber';
  const roleLabel = isBarber ? 'Barbeiro Parceiro' : 'Cliente';

  const body = `
    <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Olá, ${name}!</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Seu pré-cadastro como <strong>${roleLabel}</strong> no <strong>Barber-Now Belém</strong> foi realizado com sucesso!
    </p>

    <div class="info-box">
      <div style="font-weight: 700; margin-bottom: 10px; color: #0f172a;">📋 Dados da sua Conta:</div>
      <div style="font-size: 13px; line-height: 1.8;">
        • <strong>Nome:</strong> ${name}<br>
        • <strong>E-mail de acesso:</strong> ${toEmail}<br>
        • <strong>Perfil:</strong> ${roleLabel}<br>
        ${neighborhood ? `• <strong>Bairro base em Belém:</strong> ${neighborhood}<br>` : ''}
        • <strong>Remetente de envio:</strong> ${SENDER_EMAIL}<br>
      </div>
    </div>

    ${isBarber ? `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Com seu acesso você já pode abrir o <strong>Dashboard do Barbeiro</strong>, verificar agendamentos nos seus bairros de atendimento em Belém-PA e aprovar novos pedidos de corte a domicílio.
      </p>
    ` : `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Agora você pode agendar cortes masculinos, barba e acabamentos no conforto da sua residência em Belém-PA com os melhores barbeiros da cidade.
      </p>
    `}

    <div style="text-align: center;">
      <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
        Caso você não tenha solicitado este cadastro, por favor ignore esta mensagem.
      </p>
    </div>
  `;

  const html = wrapEmailTemplate(`Bem-vindo ao Barber-Now Belém - Cadastro de ${roleLabel}`, body);

  return await dispatchEmail({
    to: toEmail,
    subject: `💈 Confirmação de Cadastro no Barber-Now Belém (${roleLabel})`,
    html,
  });
};

// 2. Envio de Confirmação de Novo Agendamento (Para o Cliente e Barbeiro)
export const sendBookingConfirmationEmail = async (params: {
  appointmentId: string;
  clientEmail: string;
  clientName: string;
  barberName: string;
  barberEmail?: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  notes?: string;
}) => {
  const {
    appointmentId,
    clientEmail,
    clientName,
    barberName,
    barberEmail,
    serviceName,
    price,
    date,
    time,
    street,
    number,
    neighborhood,
    city,
    notes,
  } = params;

  const formattedDate = date.split('-').reverse().join('/');

  const body = `
    <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Novo Agendamento Confirmado!</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Olá <strong>${clientName}</strong>, recebemos sua solicitação de atendimento a domicílio com o profissional <strong>${barberName}</strong>.
    </p>

    <div class="info-box">
      <div style="font-weight: 700; margin-bottom: 12px; color: #0f172a; font-size: 15px;">
        ✂️ Detalhes do Atendimento #${appointmentId.slice(-6)}
      </div>
      <div style="font-size: 14px; line-height: 1.8;">
        • <strong>Serviço:</strong> ${serviceName}<br>
        • <strong>Valor:</strong> R$ ${price.toFixed(2)} (Pagamento no local)<br>
        • <strong>Barbeiro:</strong> ${barberName}<br>
        • <strong>Data:</strong> ${formattedDate}<br>
        • <strong>Horário:</strong> ${time}<br>
        • <strong>Local:</strong> ${street}, nº ${number} - Bairro ${neighborhood}, ${city}<br>
        ${notes ? `• <strong>Observações:</strong> ${notes}<br>` : ''}
        • <strong>Status Atual:</strong> <span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Aguardando aprovação do barbeiro</span>
      </div>
    </div>

    <p style="font-size: 13px; line-height: 1.6; color: #475569;">
      Assim que o barbeiro confirmar o agendamento no sistema, você receberá a notificação de confirmação e quando ele iniciar o deslocamento até o seu endereço em ${neighborhood}.
    </p>
  `;

  const html = wrapEmailTemplate(`Confirmação de Agendamento - Barber-Now Belém`, body);

  return await dispatchEmail({
    to: clientEmail,
    cc: barberEmail,
    subject: `💈 Agendamento Barber-Now: ${serviceName} em ${formattedDate} às ${time} (${neighborhood})`,
    html,
  });
};

// 3. Envio de Notificação de Status Atualizado (Aprovado, A Caminho ou Concluído)
export const sendBookingStatusUpdateEmail = async (params: {
  appointmentId: string;
  clientEmail: string;
  clientName: string;
  barberName: string;
  serviceName: string;
  status: string;
  date: string;
  time: string;
  neighborhood: string;
}) => {
  const {
    appointmentId,
    clientEmail,
    clientName,
    barberName,
    serviceName,
    status,
    date,
    time,
    neighborhood,
  } = params;

  let statusTitle = 'Atualização do seu Agendamento';
  let statusMessage = '';
  let badgeColor = '#2563eb';

  if (status === 'confirmed') {
    statusTitle = '✓ Agendamento Aprovado pelo Barbeiro!';
    statusMessage = `O barbeiro <strong>${barberName}</strong> aprovou seu pedido! Ele comparecerá no horário marcado no bairro ${neighborhood}.`;
    badgeColor = '#10b981';
  } else if (status === 'on_the_way') {
    statusTitle = '🚗 Barbeiro a Caminho da sua Residência!';
    statusMessage = `O barbeiro <strong>${barberName}</strong> iniciou o deslocamento até o seu endereço no bairro ${neighborhood}. Prepare o local para o corte!`;
    badgeColor = '#8b5cf6';
  } else if (status === 'completed') {
    statusTitle = '✂️ Atendimento Concluído com Sucesso!';
    statusMessage = `Seu corte de ${serviceName} foi finalizado. Agradecemos pela preferência pelo Barber-Now Belém!`;
    badgeColor = '#0f766e';
  } else if (status === 'cancelled') {
    statusTitle = 'Aviso: Agendamento Cancelado';
    statusMessage = `O agendamento para ${serviceName} em ${date} foi cancelado. Se desejar, agende outro horário com nossos profissionais disponíveis.`;
    badgeColor = '#ef4444';
  }

  const formattedDate = date.split('-').reverse().join('/');

  const body = `
    <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">${statusTitle}</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Olá <strong>${clientName}</strong>,<br>
      ${statusMessage}
    </p>

    <div class="info-box" style="border-left-color: ${badgeColor};">
      <div style="font-size: 13px; line-height: 1.8;">
        • <strong>Código:</strong> #${appointmentId.slice(-6)}<br>
        • <strong>Serviço:</strong> ${serviceName}<br>
        • <strong>Profissional:</strong> ${barberName}<br>
        • <strong>Data e Hora:</strong> ${formattedDate} às ${time}<br>
        • <strong>Bairro:</strong> ${neighborhood} - Belém-PA<br>
      </div>
    </div>
  `;

  const html = wrapEmailTemplate(statusTitle, body);

  return await dispatchEmail({
    to: clientEmail,
    subject: `💈 Barber-Now Belém: ${statusTitle}`,
    html,
  });
};

// 4. Função interna de disparo via Nodemailer com log detalhado e fallback
async function dispatchEmail(options: {
  to: string;
  cc?: string;
  subject: string;
  html: string;
}) {
  const isReal = isRealSmtpConfigured();
  console.log(`[E-mail Service] Preparando envio de e-mail via ${SENDER_EMAIL} para: ${options.to}`);
  console.log(`[E-mail Service] Assunto: ${options.subject}`);
  console.log(`[E-mail Service] Produzido por: 3facil.com | SMTP Real Ativo: ${isReal ? 'SIM' : 'MODO SIMULAÇÃO/TESTE'}`);

  if (!isReal) {
    console.log(`[E-mail Service] Nota: Variável SMTP_PASS não configurada. Simulando envio com sucesso pelo remetente ${SENDER_EMAIL}.`);
    return {
      success: true,
      messageId: `simulated-${Date.now()}@site3facil.com`,
      sender: SENDER_EMAIL,
      recipient: options.to,
      realSmtp: false,
      note: 'E-mail preparado e registrado pelo remetente site3facil@gmail.com (3facil.com). Para envio externo via servidor do Google, informe SMTP_PASS em .env.',
    };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: SENDER_FULL,
      to: options.to,
      cc: options.cc,
      subject: options.subject,
      html: options.html,
    });

    console.log(`[E-mail Service] E-mail enviado com sucesso via Gmail (${SENDER_EMAIL})! Message ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      sender: SENDER_EMAIL,
      recipient: options.to,
      realSmtp: true,
    };
  } catch (error: any) {
    console.error(`[E-mail Service] Erro ao enviar e-mail via Gmail (${SENDER_EMAIL}):`, error?.message || error);
    return {
      success: false,
      error: error?.message || 'Erro no envio de e-mail.',
      sender: SENDER_EMAIL,
      recipient: options.to,
      realSmtp: true,
    };
  }
}

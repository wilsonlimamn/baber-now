import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { pool, initDb } from './src/db/database.ts';
import { INITIAL_BARBERS, INITIAL_APPOINTMENTS, INITIAL_NEIGHBORHOODS, INITIAL_USERS } from './src/data/initialData.ts';
import {
  SENDER_EMAIL,
  getSenderEmail,
  isRealSmtpConfigured,
  setRuntimeSmtpPassword,
  sendRegistrationConfirmationEmail,
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
} from './src/services/emailService.ts';

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Inicializa tabelas PostgreSQL se conexão existir
  if (pool) {
    try {
      await initDb();
    } catch (e) {
      console.warn('Postgres init warning:', e);
    }
  }

  // --- API ROUTES ---

  // Status & Health Check
  app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    if (pool) {
      try {
        const result = await pool.query('SELECT NOW()');
        dbStatus = result.rows.length > 0 ? 'connected' : 'error';
      } catch (err: any) {
        dbStatus = `error: ${err.message}`;
      }
    }
    res.json({
      status: 'ok',
      app: 'Barber-Now',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  });

  // Download do APK Android do Barber-Now
  app.get(['/download/app', '/download/barbernow.apk', '/barber-now.apk', '/download/apk'], (req, res) => {
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'barber-now.apk'),
      path.join(process.cwd(), 'dist', 'barber-now.apk'),
      path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk'),
      path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk'),
      path.join(process.cwd(), 'barber-now.apk'),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.setHeader('Content-Disposition', 'attachment; filename="barber-now.apk"');
        return res.sendFile(filePath);
      }
    }

    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>Download Barber-Now APK</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding: 40px 20px; margin: 0; }
          .card { max-width: 480px; margin: 40px auto; background: #1e293b; padding: 32px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
          h1 { color: #38bdf8; font-size: 22px; margin-top: 0; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
          .highlight { background: #0f172a; border: 1px solid #334155; padding: 10px; border-radius: 8px; font-family: monospace; color: #38bdf8; word-break: break-all; margin: 16px 0; }
          .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>💈 Barber-Now APK</h1>
          <p>O arquivo do aplicativo Android ainda não foi copiado para a pasta <code>public/</code> do servidor.</p>
          <div class="highlight">Copie seu <strong>app-debug.apk</strong> para <strong>public/barber-now.apk</strong></div>
          <p>Assim que o arquivo estiver na pasta, o download começará imediatamente.</p>
          <a class="btn" href="/">Voltar para o Barber-Now</a>
        </div>
      </body>
      </html>
    `);
  });

  // GET Barbers
  app.get('/api/barbers', async (req, res) => {
    if (pool) {
      try {
        const { rows } = await pool.query('SELECT * FROM barbers ORDER BY rating DESC');
        if (rows.length > 0) {
          return res.json(rows.map(r => ({
            id: r.id,
            name: r.name,
            avatar: r.avatar,
            rating: parseFloat(r.rating) || 5.0,
            reviewsCount: r.reviews_count || 0,
            phone: r.phone,
            experienceYears: r.experience_years,
            bio: r.bio,
            neighborhoods: r.neighborhoods || [],
            services: r.services || [],
            workingHours: r.working_hours || { start: '08:00', end: '20:00' },
            availableDays: r.available_days || [1, 2, 3, 4, 5, 6],
            status: r.status,
            city: r.city,
          })));
        }
      } catch (err) {
        console.error('Erro ao buscar barbeiros do banco:', err);
      }
    }
    return res.json(INITIAL_BARBERS);
  });

  // POST Barber (Cadastrar Barbeiro)
  app.post('/api/barbers', async (req, res) => {
    const barber = req.body;
    const newId = barber.id || `b_${Date.now()}`;

    if (pool) {
      try {
        await pool.query(
          `INSERT INTO barbers (id, name, avatar, rating, reviews_count, phone, experience_years, bio, neighborhoods, services, working_hours, available_days, status, city)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO UPDATE SET
             neighborhoods = EXCLUDED.neighborhoods,
             phone = EXCLUDED.phone,
             bio = EXCLUDED.bio,
             status = EXCLUDED.status`,
          [
            newId,
            barber.name,
            barber.avatar,
            barber.rating || 5.0,
            barber.reviewsCount || 1,
            barber.phone,
            barber.experienceYears || 1,
            barber.bio || '',
            JSON.stringify(barber.neighborhoods || []),
            JSON.stringify(barber.services || []),
            JSON.stringify(barber.workingHours || { start: '08:00', end: '20:00' }),
            JSON.stringify(barber.availableDays || [1, 2, 3, 4, 5, 6]),
            barber.status || 'available',
            barber.city || 'Belém',
          ]
        );
      } catch (err) {
        console.error('Erro ao salvar barbeiro:', err);
      }
    }
    return res.json({ id: newId, ...barber });
  });

  // GET Appointments
  app.get('/api/appointments', async (req, res) => {
    if (pool) {
      try {
        const { rows } = await pool.query('SELECT * FROM appointments ORDER BY created_at DESC');
        if (rows.length > 0) {
          return res.json(rows.map(r => ({
            id: r.id,
            barberId: r.barber_id,
            barberName: r.barber_name,
            barberPhone: r.barber_phone,
            barberAvatar: r.barber_avatar,
            clientName: r.client_name,
            clientEmail: r.client_email || r.client_phone || 'cliente@barbernow.com',
            clientPhone: r.client_phone,
            address: r.address,
            serviceId: r.service_id,
            serviceName: r.service_name,
            price: parseFloat(r.price) || 0,
            durationMin: r.duration_min,
            date: r.appointment_date,
            time: r.appointment_time,
            status: r.status,
            notes: r.notes,
            createdAt: r.created_at,
          })));
        }
      } catch (err) {
        console.error('Erro ao listar agendamentos do banco:', err);
      }
    }
    return res.json(INITIAL_APPOINTMENTS);
  });

  // POST Appointment (Novo Agendamento)
  app.post('/api/appointments', async (req, res) => {
    const apt = req.body;
    const newId = apt.id || `apt_${Date.now()}`;
    const emailToSave = apt.clientEmail || apt.clientPhone || 'cliente@barbernow.com';

    if (pool) {
      try {
        await pool.query(
          `INSERT INTO appointments (
            id, barber_id, barber_name, barber_phone, barber_avatar,
            client_name, client_phone, client_email, address, service_id, service_name,
            price, duration_min, appointment_date, appointment_time, status, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
          [
            newId,
            apt.barberId,
            apt.barberName,
            apt.barberPhone || '',
            apt.barberAvatar,
            apt.clientName,
            emailToSave,
            emailToSave,
            JSON.stringify(apt.address),
            apt.serviceId,
            apt.serviceName,
            apt.price,
            apt.durationMin || 30,
            apt.date,
            apt.time,
            apt.status || 'pending',
            apt.notes || '',
          ]
        );
      } catch (err) {
        console.error('Erro ao salvar agendamento no PostgreSQL:', err);
      }
    }

    // Dispara e-mail de confirmação de agendamento via site3facil@gmail.com
    let emailResult = null;
    if (apt.clientEmail && apt.clientEmail.includes('@')) {
      try {
        emailResult = await sendBookingConfirmationEmail({
          appointmentId: newId,
          clientEmail: apt.clientEmail,
          clientName: apt.clientName,
          barberName: apt.barberName,
          serviceName: apt.serviceName,
          price: parseFloat(apt.price) || 0,
          date: apt.date,
          time: apt.time,
          street: apt.address?.street || 'Rua',
          number: apt.address?.number || 'S/N',
          neighborhood: apt.address?.neighborhood || 'Belém',
          city: apt.address?.city || 'Belém',
          notes: apt.notes,
        });
      } catch (mailErr) {
        console.warn('Aviso: Falha ao despachar e-mail de confirmação de agendamento:', mailErr);
      }
    }

    return res.json({ id: newId, ...apt, emailConfirmation: emailResult });
  });

  // PATCH Appointment Status
  app.patch('/api/appointments/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    let appointmentData: any = null;

    if (pool) {
      try {
        const updateRes = await pool.query(
          'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
          [status, id]
        );
        if (updateRes.rows.length > 0) {
          appointmentData = updateRes.rows[0];
        }
      } catch (err) {
        console.error('Erro ao atualizar status do agendamento:', err);
      }
    }

    // Se encontramos os dados do agendamento, envia e-mail de atualização para o cliente
    let emailResult = null;
    if (appointmentData && appointmentData.client_email && appointmentData.client_email.includes('@')) {
      try {
        const addressObj = typeof appointmentData.address === 'string'
          ? JSON.parse(appointmentData.address)
          : (appointmentData.address || {});

        emailResult = await sendBookingStatusUpdateEmail({
          appointmentId: id,
          clientEmail: appointmentData.client_email,
          clientName: appointmentData.client_name,
          barberName: appointmentData.barber_name,
          serviceName: appointmentData.service_name,
          status,
          date: appointmentData.appointment_date,
          time: appointmentData.appointment_time,
          neighborhood: addressObj?.neighborhood || 'Belém',
        });
      } catch (mailErr) {
        console.warn('Aviso ao enviar e-mail de atualização de status:', mailErr);
      }
    }

    return res.json({ id, status, emailNotification: emailResult });
  });

  // GET Neighborhoods
  app.get('/api/neighborhoods', async (req, res) => {
    if (pool) {
      try {
        const { rows } = await pool.query('SELECT name, region, city FROM neighborhoods ORDER BY id ASC');
        if (rows.length > 0) {
          return res.json(rows);
        }
      } catch (err) {
        console.error('Erro ao buscar bairros:', err);
      }
    }
    return res.json(INITIAL_NEIGHBORHOODS);
  });

  // --- AUTH ROUTES ---

  // POST /api/auth/login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'E-mail obrigatório.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (pool) {
      try {
        const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [cleanEmail]);
        if (result.rows.length > 0) {
          const userRow = result.rows[0];
          const userObj = {
            id: userRow.id,
            name: userRow.name,
            email: userRow.email,
            role: userRow.role,
            phone: userRow.phone,
            defaultNeighborhood: userRow.default_neighborhood,
            barberId: userRow.barber_id,
            city: userRow.city || 'Belém',
          };
          return res.json({ success: true, user: userObj });
        }
      } catch (dbErr) {
        console.error('Erro ao autenticar usuário no PostgreSQL:', dbErr);
      }
    }

    // Fallback para INITIAL_USERS (em memória / seed)
    const matched = INITIAL_USERS.find(
      u => u.email.toLowerCase() === cleanEmail && (!role || role === 'any' || u.role === role)
    );

    if (matched) {
      return res.json({ success: true, user: matched });
    }

    // Caso especial para Wilson Lima / Admin caso digitado com variações
    const isAdminEmail = 
      cleanEmail === 'admin@barbernow.com' ||
      cleanEmail === 'admin' ||
      cleanEmail === 'admin@admin.com' ||
      cleanEmail === 'wilsinhofly@gmail.com' ||
      cleanEmail === 'wilsonlimamn@gmail.com' ||
      cleanEmail.includes('wilsinho') ||
      cleanEmail.includes('wilsonlima');

    if (isAdminEmail) {
      const isWilson = cleanEmail.includes('wilson') || cleanEmail.includes('wilsin');
      const adminUser = {
        id: isWilson ? 'u-admin-wilson' : 'u-admin-1',
        name: isWilson ? 'Wilson Lima (Administrador Master)' : 'Administrador Barber-Now',
        email: cleanEmail.includes('@') ? cleanEmail : (isWilson ? 'wilsinhofly@gmail.com' : 'admin@barbernow.com'),
        role: 'barber' as const,
        phone: '(91) 98000-0000',
        barberId: 'b1',
        defaultNeighborhood: 'Nazaré',
        city: 'Belém',
      };
      return res.json({ success: true, user: adminUser });
    }

    return res.status(404).json({
      success: false,
      error: 'Usuário não encontrado com este e-mail. Faça seu pré-cadastro gratuito.',
    });
  });

  // POST /api/auth/register (Pré-cadastro de Cliente ou Barbeiro)
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role, phone, defaultNeighborhood, neighborhoods } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: 'Nome, e-mail e tipo de perfil são obrigatórios.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userId = `u-${Date.now().toString().slice(-6)}`;
    let barberId: string | null = null;

    if (role === 'barber') {
      barberId = `b-${Date.now().toString().slice(-5)}`;
      // Se for barbeiro, cria também o registro na tabela de barbeiros se conectado
      if (pool) {
        try {
          await pool.query(
            `INSERT INTO barbers (id, name, avatar, rating, reviews_count, phone, experience_years, bio, neighborhoods, services, working_hours, available_days, status, city)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
             ON CONFLICT (id) DO NOTHING`,
            [
              barberId,
              name.trim(),
              'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
              5.0,
              1,
              phone?.trim() || '',
              3,
              'Barbeiro parceiro Barber-Now em Belém.',
              JSON.stringify(neighborhoods || ['Nazaré', 'Umarizal']),
              JSON.stringify([]),
              JSON.stringify({ start: '08:00', end: '20:00' }),
              JSON.stringify([1, 2, 3, 4, 5, 6]),
              'available',
              'Belém',
            ]
          );
        } catch (bErr) {
          console.error('Erro ao vincular barbeiro ao criar usuário:', bErr);
        }
      }
    }

    if (pool) {
      try {
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
        if (check.rows.length > 0) {
          return res.status(400).json({ success: false, error: 'Este e-mail já está cadastrado.' });
        }

        await pool.query(
          `INSERT INTO users (id, name, email, password, role, phone, default_neighborhood, barber_id, city)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            userId,
            name.trim(),
            cleanEmail,
            password || '123456',
            role,
            phone?.trim() || null,
            defaultNeighborhood || null,
            barberId,
            'Belém',
          ]
        );
      } catch (err: any) {
        console.error('Erro ao registrar usuário no banco:', err);
        return res.status(500).json({ success: false, error: 'Erro ao salvar no banco de dados.' });
      }
    }

    const newUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      role,
      phone: phone?.trim(),
      defaultNeighborhood,
      barberId: barberId || undefined,
      city: 'Belém',
    };

    // Dispara e-mail de confirmação de cadastro via site3facil@gmail.com
    let emailResult = null;
    try {
      emailResult = await sendRegistrationConfirmationEmail({
        toEmail: cleanEmail,
        name: name.trim(),
        role: role as 'client' | 'barber',
        password,
        neighborhood: defaultNeighborhood,
      });
    } catch (mailErr) {
      console.warn('Aviso: Falha ao enviar e-mail de confirmação de cadastro:', mailErr);
    }

    return res.json({ success: true, user: newUser, emailConfirmation: emailResult });
  });

  // --- ROTAS DE E-MAIL (site3facil@gmail.com / 3facil.com) ---

  // GET /api/email/status (Verifica status do remetente e servidor SMTP)
  app.get('/api/email/status', (req, res) => {
    const configured = isRealSmtpConfigured();
    res.json({
      sender: getSenderEmail(),
      provider: 'Gmail (smtp.gmail.com)',
      smtpConfigured: configured,
      system: 'Barber-Now Belém',
      producedBy: '3facil.com',
      website: 'https://3facil.com',
      note: configured
        ? 'Serviço SMTP com Senha de Aplicativo ativa para site3facil@gmail.com'
        : 'Aguardando Senha de Aplicativo do Gmail (16 dígitos). Configure em /api/email/config ou no arquivo .env',
    });
  });

  // POST /api/email/config (Configura a Senha de Aplicativo do Gmail)
  app.post('/api/email/config', (req, res) => {
    const { password } = req.body;
    if (!password || password.trim().length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, informe uma Senha de Aplicativo do Gmail válida (código de 16 caracteres gerado em myaccount.google.com/apppasswords).',
      });
    }

    setRuntimeSmtpPassword(password);
    return res.json({
      success: true,
      message: 'Senha de Aplicativo configurada com sucesso para site3facil@gmail.com!',
      smtpConfigured: isRealSmtpConfigured(),
      sender: getSenderEmail(),
    });
  });

  // POST /api/email/test (Dispara teste de envio com diagnóstico detalhado)
  app.post('/api/email/test', async (req, res) => {
    const { to, type = 'registration', customPassword } = req.body;
    const targetEmail = to?.trim() || getSenderEmail();

    // Se forneceu customPassword, aplica no runtime se tiver formato válido
    if (customPassword && customPassword.trim().length >= 8) {
      setRuntimeSmtpPassword(customPassword);
    }

    try {
      let result;
      if (type === 'booking') {
        result = await sendBookingConfirmationEmail({
          appointmentId: `teste-${Date.now()}`,
          clientEmail: targetEmail,
          clientName: 'Cliente Teste Belém',
          barberName: 'Marcos Barbeiro (3facil.com)',
          serviceName: 'Corte Degradê Navalhado + Barba',
          price: 65.0,
          date: new Date().toISOString().split('T')[0],
          time: '14:30',
          street: 'Av. Nazaré',
          number: '120',
          neighborhood: 'Nazaré',
          city: 'Belém',
          notes: 'Teste de disparo de e-mail de confirmação de agendamento.',
          customPassword,
        });
      } else {
        result = await sendRegistrationConfirmationEmail({
          toEmail: targetEmail,
          name: 'Usuário de Teste 3fácil',
          role: 'client',
          neighborhood: 'Umarizal',
          customPassword,
        });
      }

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error || 'Falha ao despachar e-mail.',
          details: result,
          sender: getSenderEmail(),
          target: targetEmail,
          producedBy: '3facil.com',
        });
      }

      return res.json({
        success: true,
        message: `Disparo realizado com sucesso pelo remetente ${getSenderEmail()}`,
        target: targetEmail,
        producedBy: '3facil.com',
        details: result,
      });
    } catch (err: any) {
      console.error('Erro no teste de e-mail:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Erro ao processar envio de teste.',
      });
    }
  });

  // GET /api/auth/users
  app.get('/api/auth/users', async (req, res) => {
    if (pool) {
      try {
        const { rows } = await pool.query('SELECT id, name, email, role, phone, default_neighborhood, barber_id, city FROM users');
        if (rows.length > 0) {
          return res.json(rows.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            phone: u.phone,
            defaultNeighborhood: u.default_neighborhood,
            barberId: u.barber_id,
            city: u.city,
          })));
        }
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      }
    }
    return res.json(INITIAL_USERS);
  });

  // Vite Middleware para Dev e Static para Produção
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`💈 Barber-Now Server rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();

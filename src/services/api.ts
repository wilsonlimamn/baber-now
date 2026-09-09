import { Barber, Appointment, NeighborhoodItem, AppointmentStatus, User, UserRole } from '../types.ts';

// Garante caminho relativo no navegador/servidor e fallback remoto seguro caso execute em container local do Capacitor
const API_BASE = typeof window !== 'undefined' && window.location.protocol.startsWith('capacitor')
  ? 'https://barbernow.3facil.com'
  : (((import.meta as any).env?.VITE_API_URL as string) || '');

const apiUrl = (path: string) => `${API_BASE}${path}`;

export const api = {
  async getHealth() {
    try {
      const res = await fetch(apiUrl('/api/health'));
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  async getBarbers(): Promise<Barber[]> {
    try {
      const res = await fetch(apiUrl('/api/barbers'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha na requisição /api/barbers, usando local:', e);
    }
    return [];
  },

  async getNeighborhoods(): Promise<NeighborhoodItem[]> {
    try {
      const res = await fetch(apiUrl('/api/neighborhoods'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha na requisição /api/neighborhoods, usando local:', e);
    }
    return [];
  },

  async saveBarber(barber: Barber): Promise<Barber> {
    try {
      const res = await fetch(apiUrl('/api/barbers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(barber),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha ao sincronizar barbeiro no servidor:', e);
    }
    return barber;
  },

  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await fetch(apiUrl('/api/appointments'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha na requisição /api/appointments, usando local:', e);
    }
    return [];
  },

  async createAppointment(apt: Appointment): Promise<Appointment> {
    try {
      const res = await fetch(apiUrl('/api/appointments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apt),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha ao salvar agendamento no servidor:', e);
    }
    return apt;
  },

  async updateAppointmentStatus(id: string, status: AppointmentStatus) {
    try {
      await fetch(apiUrl(`/api/appointments/${id}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn('Falha ao atualizar status no servidor:', e);
    }
  },

  async login(email: string, password?: string, role?: UserRole): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('Falha na requisição /api/auth/login:', e);
      return { success: false, error: 'Falha de conexão com o servidor.' };
    }
  },

  async register(userData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    defaultNeighborhood?: string;
    neighborhoods?: string[];
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('Falha na requisição /api/auth/register:', e);
      return { success: false, error: 'Falha de conexão com o servidor.' };
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch(apiUrl('/api/auth/users'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha na requisição /api/auth/users:', e);
    }
    return [];
  },

  async getEmailStatus(): Promise<{
    sender: string;
    provider: string;
    smtpConfigured: boolean;
    system: string;
    producedBy: string;
    website: string;
    note: string;
  }> {
    try {
      const res = await fetch(apiUrl('/api/email/status'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha ao verificar status de e-mail:', e);
    }
    return {
      sender: 'site3facil@gmail.com',
      provider: 'Gmail (3facil.com)',
      smtpConfigured: false,
      system: 'Barber-Now Belém',
      producedBy: '3facil.com',
      website: 'https://3facil.com',
      note: 'Configurado para envio via site3facil@gmail.com',
    };
  },

  async sendTestEmail(params: {
    to: string;
    type: 'registration' | 'booking';
    customPassword?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    target?: string;
    error?: string;
    details?: any;
  }> {
    try {
      const res = await fetch(apiUrl('/api/email/test'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e?.message || 'Falha ao conectar com serviço de e-mail.' };
    }
  },

  async saveEmailPassword(password: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(apiUrl('/api/email/config'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e?.message || 'Falha ao salvar senha de aplicativo.' };
    }
  },
};

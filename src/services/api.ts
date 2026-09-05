import { Barber, Appointment, NeighborhoodItem, AppointmentStatus } from '../types.ts';

export const api = {
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  async getBarbers(): Promise<Barber[]> {
    try {
      const res = await fetch('/api/barbers');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha na requisição /api/barbers, usando local:', e);
    }
    return [];
  },

  async saveBarber(barber: Barber): Promise<Barber> {
    try {
      const res = await fetch('/api/barbers', {
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
      const res = await fetch('/api/appointments');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Falha na requisição /api/appointments, usando local:', e);
    }
    return [];
  },

  async createAppointment(apt: Appointment): Promise<Appointment> {
    try {
      const res = await fetch('/api/appointments', {
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
      await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn('Falha ao atualizar status no servidor:', e);
    }
  },
};

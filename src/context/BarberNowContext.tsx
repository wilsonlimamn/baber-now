import React, { createContext, useContext, useState, useEffect } from 'react';
import { Barber, Appointment, NeighborhoodItem, AppointmentStatus } from '../types.ts';
import { INITIAL_BARBERS, INITIAL_APPOINTMENTS, INITIAL_NEIGHBORHOODS } from '../data/initialData.ts';
import { api } from '../services/api.ts';

interface BarberNowContextType {
  barbers: Barber[];
  appointments: Appointment[];
  neighborhoods: NeighborhoodItem[];
  currentView: 'client' | 'barber_agenda' | 'barber_register';
  setCurrentView: (view: 'client' | 'barber_agenda' | 'barber_register') => void;
  selectedBarberId: string;
  setSelectedBarberId: (id: string) => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => string;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  registerBarber: (barber: Omit<Barber, 'id' | 'rating' | 'reviewsCount'>) => string;
  updateBarberNeighborhoods: (barberId: string, neighborhoods: string[]) => void;
  addNeighborhood: (name: string, region: string, city: string) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY_BARBERS = 'barber_now_barbers_v1';
const STORAGE_KEY_APPOINTMENTS = 'barber_now_appointments_v1';
const STORAGE_KEY_NEIGHBORHOODS = 'barber_now_neighborhoods_v1';

const BarberNowContext = createContext<BarberNowContextType | undefined>(undefined);

export const BarberNowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [barbers, setBarbers] = useState<Barber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BARBERS);
      return saved ? JSON.parse(saved) : INITIAL_BARBERS;
    } catch {
      return INITIAL_BARBERS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NEIGHBORHOODS);
      return saved ? JSON.parse(saved) : INITIAL_NEIGHBORHOODS;
    } catch {
      return INITIAL_NEIGHBORHOODS;
    }
  });

  const [currentView, setCurrentView] = useState<'client' | 'barber_agenda' | 'barber_register'>('client');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(INITIAL_BARBERS[0]?.id || 'b1');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // Busca dados remotos do PostgreSQL no primeiro carregamento
  useEffect(() => {
    let isMounted = true;
    api.getBarbers().then(remoteBarbers => {
      if (isMounted && remoteBarbers && remoteBarbers.length > 0) {
        setBarbers(remoteBarbers);
      }
    });
    api.getAppointments().then(remoteApts => {
      if (isMounted && remoteApts && remoteApts.length > 0) {
        setAppointments(remoteApts);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BARBERS, JSON.stringify(barbers));
    } catch (e) {
      console.error('Error saving barbers to localStorage', e);
    }
  }, [barbers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error('Error saving appointments to localStorage', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NEIGHBORHOODS, JSON.stringify(neighborhoods));
    } catch (e) {
      console.error('Error saving neighborhoods to localStorage', e);
    }
  }, [neighborhoods]);

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>): string => {
    const newId = `apt-${Date.now().toString().slice(-6)}`;
    const newApt: Appointment = {
      ...aptData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [newApt, ...prev]);
    api.createAppointment(newApt);
    return newId;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );
    api.updateAppointmentStatus(id, status);
  };

  const registerBarber = (barberData: Omit<Barber, 'id' | 'rating' | 'reviewsCount'>): string => {
    const newId = `b-${Date.now().toString().slice(-5)}`;
    const newBarber: Barber = {
      ...barberData,
      id: newId,
      rating: 5.0,
      reviewsCount: 1,
    };
    setBarbers(prev => [newBarber, ...prev]);
    setSelectedBarberId(newId);
    api.saveBarber(newBarber);
    return newId;
  };

  const updateBarberNeighborhoods = (barberId: string, updatedNeighborhoods: string[]) => {
    setBarbers(prev => {
      const next = prev.map(b => (b.id === barberId ? { ...b, neighborhoods: updatedNeighborhoods } : b));
      const target = next.find(b => b.id === barberId);
      if (target) api.saveBarber(target);
      return next;
    });
  };

  const addNeighborhood = (name: string, region: string, city: string) => {
    const exists = neighborhoods.some(n => n.name.toLowerCase() === name.trim().toLowerCase());
    if (!exists && name.trim()) {
      setNeighborhoods(prev => [...prev, { name: name.trim(), region: region || 'Geral', city: city || 'São Paulo' }]);
    }
  };

  const resetDemoData = () => {
    setBarbers(INITIAL_BARBERS);
    setAppointments(INITIAL_APPOINTMENTS);
    setNeighborhoods(INITIAL_NEIGHBORHOODS);
    setSelectedBarberId(INITIAL_BARBERS[0].id);
    localStorage.removeItem(STORAGE_KEY_BARBERS);
    localStorage.removeItem(STORAGE_KEY_APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEY_NEIGHBORHOODS);
  };

  return (
    <BarberNowContext.Provider
      value={{
        barbers,
        appointments,
        neighborhoods,
        currentView,
        setCurrentView,
        selectedBarberId,
        setSelectedBarberId,
        isMobilePreview,
        setIsMobilePreview,
        addAppointment,
        updateAppointmentStatus,
        registerBarber,
        updateBarberNeighborhoods,
        addNeighborhood,
        resetDemoData,
      }}
    >
      {children}
    </BarberNowContext.Provider>
  );
};

export const useBarberNow = () => {
  const context = useContext(BarberNowContext);
  if (!context) {
    throw new Error('useBarberNow must be used within a BarberNowProvider');
  }
  return context;
};

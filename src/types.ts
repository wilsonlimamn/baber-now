export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  experienceYears: number;
  bio: string;
  neighborhoods: string[]; // Bairros que o barbeiro atende
  services: ServiceItem[];
  workingHours: {
    start: string; // "08:00"
    end: string;   // "20:00"
  };
  availableDays: number[]; // 0 = Domingo, 1 = Segunda, etc.
  status: 'available' | 'busy' | 'offline';
  city: string;
}

export interface ClientAddress {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  city: string;
  reference?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'on_the_way' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  barberId: string;
  barberName: string;
  barberPhone?: string;
  barberAvatar: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  address: ClientAddress;
  serviceId: string;
  serviceName: string;
  price: number;
  durationMin: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface NeighborhoodItem {
  name: string;
  region: string;
  city: string;
}

export type UserRole = 'client' | 'barber';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  defaultNeighborhood?: string;
  barberId?: string; // Links to Barber profile when role === 'barber'
  city: string;
  createdAt?: string;
}


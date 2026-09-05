import { Barber, NeighborhoodItem, Appointment, ServiceItem } from '../types.ts';

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    name: 'Corte Tradicional / Degradê',
    price: 65,
    durationMin: 45,
    description: 'Corte completo com tesoura ou máquina, acabamento preciso e finalização com pomada.',
  },
  {
    id: 's2',
    name: 'Barba Terapia Completa',
    price: 50,
    durationMin: 35,
    description: 'Toalha quente, óleo pré-barba, navalhete descartável e balm refrescante.',
  },
  {
    id: 's3',
    name: 'Combo Cabelo + Barba',
    price: 100,
    durationMin: 70,
    description: 'O pacote completo no conforto da sua casa com toalha quente e finalização premium.',
  },
  {
    id: 's4',
    name: 'Corte Infantil (Kids)',
    price: 60,
    durationMin: 40,
    description: 'Atendimento com calma e paciência para os pequenos no ambiente familiar.',
  },
  {
    id: 's5',
    name: 'Pezinho & Acabamento Rápido',
    price: 35,
    durationMin: 20,
    description: 'Alinhamento dos contornos, nuca e costeletas na navalha.',
  },
];

export const INITIAL_NEIGHBORHOODS: NeighborhoodItem[] = [
  { name: 'Centro', region: 'Central', city: 'São Paulo' },
  { name: 'Pinheiros', region: 'Zona Oeste', city: 'São Paulo' },
  { name: 'Jardins', region: 'Zona Oeste', city: 'São Paulo' },
  { name: 'Vila Madalena', region: 'Zona Oeste', city: 'São Paulo' },
  { name: 'Perdizes', region: 'Zona Oeste', city: 'São Paulo' },
  { name: 'Itaim Bibi', region: 'Zona Sul', city: 'São Paulo' },
  { name: 'Moema', region: 'Zona Sul', city: 'São Paulo' },
  { name: 'Vila Mariana', region: 'Zona Sul', city: 'São Paulo' },
  { name: 'Brooklin', region: 'Zona Sul', city: 'São Paulo' },
  { name: 'Morumbi', region: 'Zona Sul', city: 'São Paulo' },
  { name: 'Santana', region: 'Zona Norte', city: 'São Paulo' },
  { name: 'Tucuruvi', region: 'Zona Norte', city: 'São Paulo' },
  { name: 'Tatuapé', region: 'Zona Leste', city: 'São Paulo' },
  { name: 'Mooca', region: 'Zona Leste', city: 'São Paulo' },
  { name: 'Anália Franco', region: 'Zona Leste', city: 'São Paulo' },
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Lucas "Navalha" Silva',
    avatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 128,
    phone: '(11) 98765-4321',
    experienceYears: 8,
    bio: 'Especialista em degradê na tesoura e barboterapia. Levo todo o equipamento profissional esterilizado até sua casa.',
    neighborhoods: ['Pinheiros', 'Jardins', 'Vila Madalena', 'Perdizes', 'Itaim Bibi'],
    services: DEFAULT_SERVICES,
    workingHours: { start: '08:00', end: '20:00' },
    availableDays: [1, 2, 3, 4, 5, 6], // Seg a Sáb
    status: 'available',
    city: 'São Paulo',
  },
  {
    id: 'b2',
    name: 'Rodrigo Fontes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 94,
    phone: '(11) 97654-3210',
    experienceYears: 6,
    bio: 'Barbeiro pontual, atencioso com cortes clássicos e barbas desenhadas. Atendimento higienizado e caprichado.',
    neighborhoods: ['Moema', 'Vila Mariana', 'Itaim Bibi', 'Brooklin', 'Centro'],
    services: DEFAULT_SERVICES.slice(0, 4),
    workingHours: { start: '09:00', end: '19:00' },
    availableDays: [1, 2, 3, 4, 5, 6],
    status: 'available',
    city: 'São Paulo',
  },
  {
    id: 'b3',
    name: 'Matheus Santos (Barber Bro)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 76,
    phone: '(11) 96543-2109',
    experienceYears: 10,
    bio: 'Mais de 10 anos de experiência. Especialista em corte infantil paciente e freestyle moderno em domicílio.',
    neighborhoods: ['Tatuapé', 'Mooca', 'Anália Franco', 'Centro'],
    services: DEFAULT_SERVICES,
    workingHours: { start: '08:00', end: '21:00' },
    availableDays: [0, 1, 2, 3, 4, 5, 6],
    status: 'available',
    city: 'São Paulo',
  },
  {
    id: 'b4',
    name: 'Gabriel "Carioca" Lima',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 62,
    phone: '(11) 95432-1098',
    experienceYears: 5,
    bio: 'Atendimento pontual na Zona Norte e Centro. Maleta completa com espelho, capa descartável e máquina silenciosa.',
    neighborhoods: ['Santana', 'Tucuruvi', 'Centro', 'Perdizes'],
    services: DEFAULT_SERVICES,
    workingHours: { start: '09:00', end: '20:00' },
    availableDays: [2, 3, 4, 5, 6],
    status: 'available',
    city: 'São Paulo',
  }
];

// Helper to get formatted date string: YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    barberId: 'b1',
    barberName: 'Lucas "Navalha" Silva',
    barberPhone: '(11) 98765-4321',
    barberAvatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
    clientName: 'Eduardo Ribeiro',
    clientPhone: '(11) 99123-4567',
    address: {
      street: 'Rua Fradique Coutinho',
      number: '480',
      complement: 'Apto 62',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      reference: 'Próximo ao metrô Fradique',
    },
    serviceId: 's3',
    serviceName: 'Combo Cabelo + Barba',
    price: 100,
    durationMin: 70,
    date: getTodayDateString(),
    time: '09:30',
    status: 'confirmed',
    notes: 'Por favor avisar na portaria ao chegar.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-102',
    barberId: 'b1',
    barberName: 'Lucas "Navalha" Silva',
    barberPhone: '(11) 98765-4321',
    barberAvatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
    clientName: 'Marcelo Costa',
    clientPhone: '(11) 98877-6655',
    address: {
      street: 'Alameda Lorena',
      number: '1240',
      complement: 'Casa 2',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      reference: 'Portão preto',
    },
    serviceId: 's1',
    serviceName: 'Corte Tradicional / Degradê',
    price: 65,
    durationMin: 45,
    date: getTodayDateString(),
    time: '14:00',
    status: 'pending',
    notes: 'Degradê médio na zero.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-103',
    barberId: 'b1',
    barberName: 'Lucas "Navalha" Silva',
    barberPhone: '(11) 98765-4321',
    barberAvatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
    clientName: 'Felipe Alencar',
    clientPhone: '(11) 97711-2233',
    address: {
      street: 'Rua Harmonia',
      number: '215',
      complement: 'Apto 101 Bloco B',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      reference: 'Interfone 101B',
    },
    serviceId: 's2',
    serviceName: 'Barba Terapia Completa',
    price: 50,
    durationMin: 35,
    date: getOffsetDateString(1),
    time: '11:00',
    status: 'confirmed',
    notes: 'Toalha quente caprichada.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-104',
    barberId: 'b2',
    barberName: 'Rodrigo Fontes',
    barberPhone: '(11) 97654-3210',
    barberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    clientName: 'Thiago Martins',
    clientPhone: '(11) 96655-4433',
    address: {
      street: 'Av. Bem-te-vi',
      number: '310',
      complement: 'Apto 14',
      neighborhood: 'Moema',
      city: 'São Paulo',
      reference: 'Esquina com Pavão',
    },
    serviceId: 's3',
    serviceName: 'Combo Cabelo + Barba',
    price: 100,
    durationMin: 70,
    date: getTodayDateString(),
    time: '16:30',
    status: 'pending',
    notes: 'Favor trazer máquina de cartão ou Pix.',
    createdAt: new Date().toISOString(),
  }
];

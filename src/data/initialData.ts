import { Barber, NeighborhoodItem, Appointment, ServiceItem, User } from '../types.ts';

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    name: 'Corte Tradicional / Degradê',
    price: 45,
    durationMin: 45,
    description: 'Corte completo com tesoura ou máquina, acabamento preciso e finalização com pomada.',
  },
  {
    id: 's2',
    name: 'Barba Terapia Completa',
    price: 35,
    durationMin: 35,
    description: 'Toalha quente, óleo pré-barba, navalhete descartável e balm refrescante.',
  },
  {
    id: 's3',
    name: 'Combo Cabelo + Barba',
    price: 70,
    durationMin: 70,
    description: 'O pacote completo no conforto da sua casa com toalha quente e finalização premium.',
  },
  {
    id: 's4',
    name: 'Corte Infantil (Kids)',
    price: 40,
    durationMin: 40,
    description: 'Atendimento com calma e paciência para os pequenos no ambiente familiar.',
  },
  {
    id: 's5',
    name: 'Pezinho & Acabamento Rápido',
    price: 25,
    durationMin: 20,
    description: 'Alinhamento dos contornos, nuca e costeletas na navalha.',
  },
];

export const INITIAL_NEIGHBORHOODS: NeighborhoodItem[] = [
  // Região Centro
  { name: 'Nazaré', region: 'Centro', city: 'Belém' },
  { name: 'Batista Campos', region: 'Centro', city: 'Belém' },
  { name: 'Campina', region: 'Centro', city: 'Belém' },
  { name: 'Cidade Velha', region: 'Centro', city: 'Belém' },
  { name: 'Reduto', region: 'Centro', city: 'Belém' },
  // Região Centro-Sul
  { name: 'Umarizal', region: 'Centro-Sul', city: 'Belém' },
  { name: 'Marco', region: 'Centro-Sul', city: 'Belém' },
  { name: 'Souza', region: 'Centro-Sul', city: 'Belém' },
  // Região Sul
  { name: 'Pedreira', region: 'Sul', city: 'Belém' },
  { name: 'Telégrafo', region: 'Sul', city: 'Belém' },
  { name: 'Guamá', region: 'Sul', city: 'Belém' },
  { name: 'Jurunas', region: 'Sul', city: 'Belém' },
  { name: 'Marambaia', region: 'Sul', city: 'Belém' },
  // Região Norte
  { name: 'Sacramenta', region: 'Norte', city: 'Belém' },
  { name: 'Val-de-Cans', region: 'Norte', city: 'Belém' },
  // Distrito de Icoaraci
  { name: 'Icoaraci', region: 'Distrito de Icoaraci', city: 'Belém' },
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Lucas "Navalha" Silva',
    avatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 128,
    phone: '(91) 98765-4321',
    experienceYears: 8,
    bio: 'Especialista em degradê na tesoura e barboterapia. Levo todo o equipamento profissional esterilizado até sua casa.',
    neighborhoods: ['Nazaré', 'Umarizal', 'Batista Campos', 'Reduto', 'Cidade Velha'],
    services: DEFAULT_SERVICES,
    workingHours: { start: '08:00', end: '20:00' },
    availableDays: [1, 2, 3, 4, 5, 6], // Seg a Sáb
    status: 'available',
    city: 'Belém',
  },
  {
    id: 'b2',
    name: 'Rodrigo Fontes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 94,
    phone: '(91) 97654-3210',
    experienceYears: 6,
    bio: 'Barbeiro pontual, atencioso com cortes clássicos e barbas desenhadas. Atendimento higienizado e caprichado.',
    neighborhoods: ['Marco', 'Pedreira', 'Telégrafo', 'Souza', 'Umarizal'],
    services: DEFAULT_SERVICES.slice(0, 4),
    workingHours: { start: '09:00', end: '19:00' },
    availableDays: [1, 2, 3, 4, 5, 6],
    status: 'available',
    city: 'Belém',
  },
  {
    id: 'b3',
    name: 'Matheus Santos (Barber Bro)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 76,
    phone: '(91) 96543-2109',
    experienceYears: 10,
    bio: 'Mais de 10 anos de experiência. Especialista em corte infantil paciente e freestyle moderno em domicílio.',
    neighborhoods: ['Marambaia', 'Sacramenta', 'Val-de-Cans', 'Marco'],
    services: DEFAULT_SERVICES,
    workingHours: { start: '08:00', end: '21:00' },
    availableDays: [0, 1, 2, 3, 4, 5, 6],
    status: 'available',
    city: 'Belém',
  },
  {
    id: 'b4',
    name: 'Gabriel Lima',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 62,
    phone: '(91) 95432-1098',
    experienceYears: 5,
    bio: 'Atendimento pontual em Belém e região metropolitana. Maleta completa com espelho, capa descartável e máquina silenciosa.',
    neighborhoods: ['Campina', 'Jurunas', 'Guamá', 'Icoaraci', 'Batista Campos'],
    services: DEFAULT_SERVICES,
    workingHours: { start: '09:00', end: '20:00' },
    availableDays: [2, 3, 4, 5, 6],
    status: 'available',
    city: 'Belém',
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
    barberAvatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
    clientName: 'Eduardo Ribeiro',
    clientEmail: 'eduardo.ribeiro@email.com',
    address: {
      street: 'Av. Governador José Malcher',
      number: '815',
      complement: 'Apto 402',
      neighborhood: 'Nazaré',
      city: 'Belém',
      reference: 'Próximo à Basílica Santuário',
    },
    serviceId: 's3',
    serviceName: 'Combo Cabelo + Barba',
    price: 70,
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
    barberAvatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
    clientName: 'Marcelo Costa',
    clientEmail: 'marcelo.costa@email.com',
    address: {
      street: 'Travessa Padre Eutíquio',
      number: '1070',
      complement: 'Apto 12',
      neighborhood: 'Batista Campos',
      city: 'Belém',
      reference: 'Em frente à Praça Batista Campos',
    },
    serviceId: 's1',
    serviceName: 'Corte Tradicional / Degradê',
    price: 45,
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
    barberAvatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
    clientName: 'Felipe Alencar',
    clientEmail: 'felipe.alencar@email.com',
    address: {
      street: 'Av. Visconde de Souza Franco',
      number: '560',
      complement: 'Torre Sun, Apto 901',
      neighborhood: 'Umarizal',
      city: 'Belém',
      reference: 'Doca, próximo ao Shopping Boulevard',
    },
    serviceId: 's2',
    serviceName: 'Barba Terapia Completa',
    price: 35,
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
    barberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    clientName: 'Thiago Martins',
    clientEmail: 'thiago.martins@email.com',
    address: {
      street: 'Rua dos Mundurucus',
      number: '2450',
      complement: 'Casa dos fundos',
      neighborhood: 'Jurunas',
      city: 'Belém',
      reference: 'Entre 14 de Março e Generalíssimo',
    },
    serviceId: 's3',
    serviceName: 'Combo Cabelo + Barba',
    price: 70,
    durationMin: 70,
    date: getTodayDateString(),
    time: '16:30',
    status: 'pending',
    notes: 'Favor trazer máquina de cartão ou Pix.',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-1',
    name: 'Administrador Barber-Now',
    email: 'admin@barbernow.com',
    role: 'barber',
    phone: '(91) 98000-0001',
    barberId: 'b1',
    defaultNeighborhood: 'Nazaré',
    city: 'Belém',
  },
  {
    id: 'u-admin-wilson',
    name: 'Wilson Lima (Administrador)',
    email: 'wilsonlimamn@gmail.com',
    role: 'barber',
    phone: '(91) 98000-0002',
    barberId: 'b1',
    defaultNeighborhood: 'Nazaré',
    city: 'Belém',
  },
  {
    id: 'u-barber-1',
    name: 'Lucas "Navalha" Silva',
    email: 'lucas@barbernow.com',
    role: 'barber',
    phone: '(91) 98111-2233',
    barberId: 'b1',
    city: 'Belém',
  },
  {
    id: 'u-barber-2',
    name: 'Rodrigo Fontes',
    email: 'rodrigo@barbernow.com',
    role: 'barber',
    phone: '(91) 98222-3344',
    barberId: 'b2',
    city: 'Belém',
  },
  {
    id: 'u-client-1',
    name: 'Carlos Eduardo',
    email: 'carlos@email.com',
    role: 'client',
    phone: '(91) 98444-5566',
    defaultNeighborhood: 'Nazaré',
    city: 'Belém',
  },
  {
    id: 'u-client-2',
    name: 'Rafael Mendes',
    email: 'rafael@email.com',
    role: 'client',
    phone: '(91) 98555-6677',
    defaultNeighborhood: 'Marco',
    city: 'Belém',
  },
];


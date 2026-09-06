import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Scissors,
  CheckCircle2,
  ChevronRight,
  User,
  Mail,
  Star,
  ShieldCheck,
  Sparkles,
  Home,
  AlertTriangle,
  ArrowLeft,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useBarberNow } from '../../context/BarberNowContext.tsx';
import { Barber, ServiceItem, ClientAddress } from '../../types.ts';
import { getTodayDateString, getOffsetDateString, DEFAULT_SERVICES } from '../../data/initialData.ts';
import { BarbersGallery } from './BarbersGallery.tsx';
import { BarberDetailModal } from './BarberDetailModal.tsx';
import { BelemCoverageMap } from '../common/BelemCoverageMap.tsx';

interface ClientBookingFlowProps {
  onBookingSuccess: (appointmentId: string) => void;
  onOpenClientAppointments?: () => void;
}

export const ClientBookingFlow: React.FC<ClientBookingFlowProps> = ({
  onBookingSuccess,
  onOpenClientAppointments,
}) => {
  const {
    barbers,
    neighborhoods,
    addAppointment,
    setCurrentView,
    setSelectedBarberId,
    currentUser,
    openAuthModal,
    appointments,
  } = useBarberNow();

  // Se o usuário está no fluxo de agendamento ativo ou na vitrine inicial
  const [isBookingActive, setIsBookingActive] = useState<boolean>(false);
  const [pendingStartBooking, setPendingStartBooking] = useState<boolean>(false);

  // Step state: 1 = Address, 2 = Date/Time & Service, 3 = Select Barber, 4 = Client Details & Confirm
  const [step, setStep] = useState<number>(1);

  // Address State
  const [address, setAddress] = useState<ClientAddress>({
    street: '',
    number: '',
    neighborhood: neighborhoods[0]?.name || 'Nazaré',
    complement: '',
    city: neighborhoods[0]?.city || 'Belém',
    reference: '',
  });

  // Service & Time State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(DEFAULT_SERVICES[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState<string>('14:00');

  // Barber State
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  // Barber Lightbox / Preview State
  const [previewBarber, setPreviewBarber] = useState<Barber | null>(null);

  // Handle starting the booking flow (requiring login or initiating wizard)
  const handleStartBooking = (barber?: Barber) => {
    if (barber) {
      setSelectedBarber(barber);
      setSelectedBarberId(barber.id);

      // If current neighborhood isn't served by this barber, adapt neighborhood to barber's main one
      const servesCurrent = barber.neighborhoods.some(
        n => n.toLowerCase() === address.neighborhood.toLowerCase()
      );
      if (!servesCurrent && barber.neighborhoods.length > 0) {
        setAddress(prev => ({ ...prev, neighborhood: barber.neighborhoods[0] }));
      }
    }

    if (!currentUser) {
      setPendingStartBooking(true);
      openAuthModal('login');
      return;
    }

    setIsBookingActive(true);
    setStep(1);
  };

  // Handle selecting a barber from the gallery
  const handleSelectBarberFromGallery = (barber: Barber) => {
    handleStartBooking(barber);
  };

  // Client Identification
  const [clientName, setClientName] = useState<string>(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState<string>(currentUser?.email || '');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Auto pre-fill if user logs in
  useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.name);
      setClientEmail(currentUser.email);
      if (currentUser.defaultNeighborhood) {
        setAddress(prev => ({
          ...prev,
          neighborhood: currentUser.defaultNeighborhood || prev.neighborhood,
        }));
      }
      if (pendingStartBooking) {
        setIsBookingActive(true);
        setPendingStartBooking(false);
      }
    }
  }, [currentUser, pendingStartBooking]);

  // Success state
  const [completedAppointmentId, setCompletedAppointmentId] = useState<string | null>(null);

  // Garantir que o bairro e cidade selecionados correspondam à lista de Belém
  useEffect(() => {
    if (neighborhoods.length > 0) {
      const exists = neighborhoods.some(n => n.name.toLowerCase() === address.neighborhood.toLowerCase());
      if (!exists || address.city !== 'Belém') {
        setAddress(prev => ({
          ...prev,
          neighborhood: neighborhoods[0].name,
          city: neighborhoods[0].city || 'Belém',
        }));
      }
    }
  }, [neighborhoods]);

  // Available barbers who cover the selected neighborhood
  const availableBarbersForNeighborhood = barbers.filter(barber =>
    barber.neighborhoods.some(n => n.toLowerCase() === address.neighborhood.toLowerCase())
  );

  const selectedService = DEFAULT_SERVICES.find(s => s.id === selectedServiceId) || DEFAULT_SERVICES[0];

  const timeSlots = [
    '08:30', '09:30', '10:30', '11:30', '13:00', '14:00', '15:00', '16:30', '17:30', '18:30', '19:30'
  ];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Para confirmar seu agendamento, é necessário estar conectado à sua conta.');
      openAuthModal('login');
      return;
    }

    if (!selectedBarber) {
      alert('Por favor, selecione um barbeiro disponível.');
      return;
    }

    const effectiveName = currentUser.name || clientName.trim();
    const effectiveEmail = currentUser.email || clientEmail.trim();
    const effectivePhone = currentUser.phone || '';

    if (!effectiveName || !effectiveEmail || !effectiveEmail.includes('@') || !effectiveEmail.includes('.')) {
      alert('Por favor, confirme seus dados para o agendamento.');
      return;
    }

    const newId = addAppointment({
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      barberPhone: selectedBarber.phone,
      barberAvatar: selectedBarber.avatar,
      clientName: effectiveName,
      clientEmail: effectiveEmail,
      clientPhone: effectivePhone || effectiveEmail,
      address,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      durationMin: selectedService.durationMin,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      notes: clientNotes.trim() || undefined,
    });

    setCompletedAppointmentId(newId);
    onBookingSuccess(newId);
  };

  if (completedAppointmentId) {
    return (
      <div className="w-full max-w-2xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 text-center shadow-lg">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Solicitação Enviada com Sucesso!</h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-5">
            O barbeiro <span className="font-semibold text-blue-600">{selectedBarber?.name}</span> já recebeu seu pedido na agenda.
          </p>

          {/* Email and Platform Notification Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 sm:p-4 text-left mb-6 flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 space-y-1">
              <p className="font-bold text-blue-950 flex items-center justify-between">
                <span>Notificação Enviada por E-mail</span>
                <span className="text-[10px] font-mono bg-blue-100/90 text-blue-800 px-2 py-0.5 rounded font-semibold">
                  site3facil@gmail.com
                </span>
              </p>
              <p className="text-blue-800 leading-relaxed">
                Os detalhes e atualizações do seu corte foram enviados para <strong className="font-semibold text-blue-950">{clientEmail}</strong> diretamente pelo remetente oficial <strong>site3facil@gmail.com</strong> (sistema desenvolvido e produzido por <a href="https://3facil.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-blue-900 hover:text-blue-950">3facil.com</a>).
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-left mb-6 space-y-2.5 text-xs sm:text-sm text-slate-700">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500">Código do Pedido:</span>
              <span className="font-mono font-bold text-blue-600">#{completedAppointmentId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Serviço:</span>
              <span className="font-semibold text-slate-900">{selectedService.name} (R$ {selectedService.price})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Data e Horário:</span>
              <span className="font-semibold text-slate-900">{selectedDate.split('-').reverse().join('/')} às {selectedTime}</span>
            </div>
            <div className="flex justify-between items-start gap-2">
              <span className="text-slate-500 shrink-0">Endereço:</span>
              <span className="text-right font-medium text-slate-900 break-words">
                {address.street}, {address.number} - {address.neighborhood}
                {address.complement ? ` (${address.complement})` : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">E-mail do Cliente:</span>
              <span className="font-medium text-slate-900">{clientEmail}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-slate-500">Barbeiro:</span>
              <span className="font-semibold text-slate-900">{selectedBarber?.name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            {onOpenClientAppointments && (
              <button
                id="btn-view-client-appointments-success"
                onClick={onOpenClientAppointments}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Acompanhar em Meus Agendamentos</span>
              </button>
            )}

            <button
              id="btn-view-barber-agenda-check"
              onClick={() => {
                if (selectedBarber) {
                  setSelectedBarberId(selectedBarber.id);
                  setCurrentView('barber_agenda');
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <span>Ver na Agenda do Barbeiro</span>
            </button>

            <button
              id="btn-new-booking"
              onClick={() => {
                setCompletedAppointmentId(null);
                setStep(1);
                setSelectedBarber(null);
                setIsBookingActive(true);
              }}
              className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-medium text-sm transition cursor-pointer"
            >
              Fazer Outro Agendamento
            </button>

            <button
              type="button"
              id="btn-back-home-after-booking"
              onClick={() => {
                setCompletedAppointmentId(null);
                setIsBookingActive(false);
                setStep(1);
              }}
              className="w-full text-center py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer underline"
            >
              ← Voltar para a Página Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário ainda não iniciou o fluxo interativo de agendamento, mostra a Vitrine Inicial com o botão Agende
  if (!isBookingActive) {
    return (
      <div className="w-full max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-6">
        {/* Hero Welcome Card */}
        <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Barbearia Delivery em Domicílio • Belém-PA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Corte Cabelo & Barba no Conforto da Sua Casa
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Atendimento executivo e profissional com os melhores barbeiros credenciados em Belém. Sem trânsito, sem espera, com equipamento 100% esterilizado e hora marcada.
              </p>

              {/* Trust badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">Barbeiros Verificados</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800">Equipamento Esterilizado</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">Pagamento no Local</span>
                </div>
              </div>
            </div>

            {/* Barber Trust Avatars in Hero */}
            <div className="shrink-0 flex flex-col items-center lg:items-end gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex -space-x-3 overflow-hidden">
                {barbers.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setPreviewBarber(b)}
                    className="inline-block relative rounded-full ring-2 ring-white hover:ring-blue-500 hover:z-10 transition cursor-pointer"
                    title={`Ver foto e perfil de ${b.name}`}
                  >
                    <img
                      src={b.avatar}
                      alt={b.name}
                      className="h-11 w-11 rounded-full object-cover shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-end gap-1.5">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">4.9 / 5.0</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {barbers.length} profissionais disponíveis em Belém
                </p>
              </div>
            </div>
          </div>

          {/* Destaque Central: O Botão AGENDE e Status do Usuário */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            {currentUser ? (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Olá, {currentUser.name}!
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                        Conta Ativa
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Conectado como {currentUser.email} • Belém-PA
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    id="btn-main-schedule-hero-logged"
                    onClick={() => handleStartBooking()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Agendar Atendimento a Domicílio</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {onOpenClientAppointments && (
                    <button
                      type="button"
                      id="btn-open-my-appointments-hero"
                      onClick={onOpenClientAppointments}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer shrink-0"
                    >
                      Meus Agendamentos
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cadastro Obrigatório para Confirmar Atendimento</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Solicite seu atendimento a domicílio com hora marcada
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    Para garantir a segurança do cliente e do barbeiro parceiro, o agendamento requer login ou cadastro prévio. Os dados são salvos no banco de dados e você recebe a confirmação imediata por e-mail.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  <button
                    id="btn-main-schedule-hero-guest"
                    onClick={() => handleStartBooking()}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition shadow-md cursor-pointer hover:scale-[1.02]"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Agendar Atendimento</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="btn-hero-guest-login"
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition cursor-pointer text-center"
                  >
                    Já tenho conta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Como Funciona o Atendimento em Domicílio (3 Passos Claros) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Agende em 1 Minuto</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Informe seu endereço em Belém (Nazaré, Umarizal, Marco, etc.), selecione o corte e o horário mais conveniente.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <span>Cadastro rápido no banco de dados</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Barbeiro Vai Até Você</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                O profissional credenciado se desloca até sua casa ou escritório com maleta completa e ferramentas higienizadas.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>Sem trânsito nem espera</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Pague no Local</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Após ser atendido com padrão de barbearia executiva, pague diretamente ao profissional via Pix, Cartão ou Dinheiro.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
              <span>Confirmação enviada por e-mail</span>
            </div>
          </div>
        </div>

        {/* Galeria Completa dos Barbeiros de Belém */}
        <BarbersGallery
          barbers={barbers}
          selectedNeighborhood={address.neighborhood}
          selectedBarber={selectedBarber}
          onSelectBarber={handleSelectBarberFromGallery}
          onOpenBarberModal={b => setPreviewBarber(b)}
        />

        {/* Mapa e Cobertura dos Bairros em Belém */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Bairros Atendidos em Belém-PA</h2>
              <p className="text-xs text-slate-500">
                Nossos barbeiros atendem nas principais zonas urbanas de Belém com agilidade.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {neighborhoods.length} Bairros Mapeados
            </span>
          </div>

          <BelemCoverageMap
            neighborhood={address.neighborhood}
            street={address.street}
            number={address.number}
            city={address.city}
            availableBarbersCount={availableBarbersForNeighborhood.length}
            showToggle={false}
            defaultExpanded={true}
          />
        </div>

        {/* Chamada Final Inferior */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 text-center shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Pronto para renovar seu visual hoje?</h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-lg mx-auto mb-5">
            Escolha seu horário e receba um barbeiro profissional credenciado sem sair do conforto da sua casa.
          </p>
          <button
            id="btn-bottom-schedule-cta"
            onClick={() => handleStartBooking()}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-blue-900 font-bold px-8 py-3.5 rounded-xl text-sm transition shadow-lg cursor-pointer"
          >
            <Scissors className="w-4 h-4 text-blue-600" />
            <span>Agendar Atendimento a Domicílio</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Barber Detail Lightbox Modal */}
        <BarberDetailModal
          barber={previewBarber}
          onClose={() => setPreviewBarber(null)}
          onSelectBarber={handleSelectBarberFromGallery}
          isSelected={selectedBarber?.id === previewBarber?.id}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-6">
      {/* Top Bar com Botão Voltar e Status de Autenticação */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          id="btn-back-to-home-showcase"
          onClick={() => setIsBookingActive(false)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Página Inicial / Vitrine</span>
        </button>

        {currentUser ? (
          <div className="flex items-center gap-2 text-xs text-slate-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Agendando como: <strong>{currentUser.name}</strong> ({currentUser.email})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-700 font-medium">Não autenticado</span>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Fazer Login
            </button>
          </div>
        )}
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between mb-2 px-2">
        {[
          { num: 1, label: 'Endereço', icon: MapPin },
          { num: 2, label: 'Serviço & Data', icon: CalendarIcon },
          { num: 3, label: 'Barbeiro', icon: Scissors },
          { num: 4, label: 'Confirmar', icon: CheckCircle2 },
        ].map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;

          return (
            <React.Fragment key={s.num}>
              <div
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                className={`flex items-center gap-2 select-none ${
                  s.num < step ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                      : isDone
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isDone ? '✓' : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    isActive ? 'text-blue-600 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded transition ${
                    step > idx + 1 ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {/* Selected Barber Feedback if pre-selected from photo gallery */}
          {selectedBarber && (
            <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedBarber.avatar}
                  alt={selectedBarber.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shrink-0 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{selectedBarber.name}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                      Barbeiro Selecionado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    O profissional atenderá no endereço informado abaixo ({address.neighborhood}).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBarber(null)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer shrink-0"
              >
                Trocar Barbeiro
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Onde será o atendimento?</h2>
              <p className="text-xs text-slate-500">
                O barbeiro irá até a sua residência ou trabalho no bairro indicado.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Neighborhood selector */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bairro de Atendimento <span className="text-blue-600">*</span>
              </label>
              <select
                id="select-neighborhood"
                value={address.neighborhood}
                onChange={e => {
                  const sel = e.target.value;
                  const found = neighborhoods.find(n => n.name === sel);
                  setAddress(prev => ({
                    ...prev,
                    neighborhood: sel,
                    city: found?.city || prev.city,
                  }));
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
              >
                {neighborhoods.map(n => (
                  <option key={n.name} value={n.name}>
                    {n.name} ({n.region} - {n.city})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Filtraremos os barbeiros com disponibilidade para atender neste bairro.
              </p>
            </div>

            {/* Street */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rua / Avenida <span className="text-blue-600">*</span>
              </label>
              <input
                id="input-street"
                type="text"
                placeholder="Ex: Av. Governador José Malcher, 815"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
              />
            </div>

            {/* Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Número <span className="text-blue-600">*</span>
              </label>
              <input
                id="input-number"
                type="text"
                placeholder="Ex: 850"
                value={address.number}
                onChange={e => setAddress({ ...address, number: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
              />
            </div>

            {/* Complement */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Complemento (Opcional)
              </label>
              <input
                id="input-complement"
                type="text"
                placeholder="Ex: Apto 42, Bloco 2"
                value={address.complement}
                onChange={e => setAddress({ ...address, complement: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
              />
            </div>

            {/* Reference */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ponto de Referência / Instruções de Portaria
              </label>
              <input
                id="input-reference"
                type="text"
                placeholder="Ex: Próximo à padaria, interfone 42, portaria 24h"
                value={address.reference}
                onChange={e => setAddress({ ...address, reference: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Mapa Interativo de Cobertura em Belém (100% Gratuito e Leve) */}
          <div className="mt-5">
            <BelemCoverageMap
              neighborhood={address.neighborhood}
              street={address.street}
              number={address.number}
              city={address.city}
              availableBarbersCount={availableBarbersForNeighborhood.length}
              showToggle={true}
              defaultExpanded={true}
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end">
            <button
              id="btn-step1-next"
              onClick={() => {
                if (!address.street.trim() || !address.number.trim()) {
                  alert('Por favor, preencha o nome da rua e o número.');
                  return;
                }
                setStep(2);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 sm:py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
            >
              <span>Avançar para Serviços e Horário</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Service & Date/Time */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Escolha o Serviço e Quando</h2>
              <p className="text-xs text-slate-500">
                Selecione o corte desejado e o melhor horário para receber o barbeiro.
              </p>
            </div>
          </div>

          {/* Service Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2.5">
              Selecione o Serviço:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEFAULT_SERVICES.map(service => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    id={`service-card-${service.id}`}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer text-left flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-600 text-slate-900 ring-2 ring-blue-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-slate-900">{service.name}</span>
                        <span className="font-bold text-blue-600 text-sm whitespace-nowrap">
                          R$ {service.price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-3">
                      <Clock className="w-3 h-3" />
                      <span>{service.durationMin} minutos</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2.5">
              Escolha a Data:
            </label>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                id="btn-date-today"
                onClick={() => setSelectedDate(getTodayDateString())}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  selectedDate === getTodayDateString()
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Hoje ({getTodayDateString().split('-').reverse().slice(0, 2).join('/')})
              </button>

              <button
                type="button"
                id="btn-date-tomorrow"
                onClick={() => setSelectedDate(getOffsetDateString(1))}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  selectedDate === getOffsetDateString(1)
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Amanhã ({getOffsetDateString(1).split('-').reverse().slice(0, 2).join('/')})
              </button>

              <button
                type="button"
                id="btn-date-plus2"
                onClick={() => setSelectedDate(getOffsetDateString(2))}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  selectedDate === getOffsetDateString(2)
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Depois de amanhã ({getOffsetDateString(2).split('-').reverse().slice(0, 2).join('/')})
              </button>

              {/* Custom Date Input */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1 text-xs">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={selectedDate}
                  min={getTodayDateString()}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="bg-transparent text-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Time Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2.5">
              Escolha o Horário Disponível:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {timeSlots.map(time => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    id={`time-slot-${time.replace(':', '')}`}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setStep(1)}
              className="w-full sm:w-auto text-center py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
            >
              ← Voltar ao endereço
            </button>

            <button
              id="btn-step2-next"
              onClick={() => {
                // Auto-select first available barber if none selected
                if (!selectedBarber && availableBarbersForNeighborhood.length > 0) {
                  setSelectedBarber(availableBarbersForNeighborhood[0]);
                }
                setStep(3);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 sm:py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
            >
              <span>Ver Barbeiros para {address.neighborhood}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Available Barber in Neighborhood */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Barbeiros disponíveis no bairro <span className="text-blue-600">{address.neighborhood}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Estes profissionais cadastraram disponibilidade para atender na sua região.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {availableBarbersForNeighborhood.length} barbeiro(s)
            </span>
          </div>

          {availableBarbersForNeighborhood.length === 0 ? (
            <div className="bg-slate-50 border border-amber-300 rounded-xl p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">
                Nenhum barbeiro atende especificamente o bairro &quot;{address.neighborhood}&quot; no momento
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Você pode escolher um bairro próximo ou selecionar um de nossos barbeiros que atendem regiões vizinhas:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition font-medium cursor-pointer"
                >
                  Trocar Bairro no Endereço
                </button>
                <button
                  onClick={() => {
                    // Show all barbers as fallback
                    if (barbers.length > 0) {
                      setSelectedBarber(barbers[0]);
                      setStep(4);
                    }
                  }}
                  className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition cursor-pointer"
                >
                  Solicitar com Barbeiro mais próximo ({barbers[0]?.name})
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableBarbersForNeighborhood.map(barber => {
                const isSelected = selectedBarber?.id === barber.id;
                return (
                  <div
                    key={barber.id}
                    id={`barber-card-${barber.id}`}
                    onClick={() => setSelectedBarber(barber)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/40 border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={barber.avatar}
                          alt={barber.name}
                          className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 truncate">{barber.name}</h3>
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{barber.rating.toFixed(1)}</span>
                              <span className="text-slate-400 font-normal">({barber.reviewsCount})</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{barber.bio}</p>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {barber.experienceYears} anos de profissão • {barber.city}
                          </div>
                        </div>
                      </div>

                      {/* Covered Neighborhoods Badges */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
                          Bairros atendidos:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {barber.neighborhoods.slice(0, 4).map(nb => (
                            <span
                              key={nb}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                nb.toLowerCase() === address.neighborhood.toLowerCase()
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {nb}
                            </span>
                          ))}
                          {barber.neighborhoods.length > 4 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              +{barber.neighborhoods.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 flex items-center justify-between border-t border-slate-100">
                      <div className="text-xs">
                        <span className="text-slate-500">Total: </span>
                        <span className="font-bold text-blue-600">R$ {selectedService.price}</span>
                      </div>

                      <button
                        type="button"
                        className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ Selecionado' : 'Escolher Barbeiro'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setStep(2)}
              className="w-full sm:w-auto text-center py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
            >
              ← Voltar para Serviços
            </button>

            <button
              id="btn-step3-next"
              disabled={!selectedBarber}
              onClick={() => setStep(4)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 sm:py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
            >
              <span>Avançar para Seus Dados</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Client Identification & Final Confirmation */}
      {step === 4 && (
        <form onSubmit={handleConfirmBooking} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Seus Dados e Confirmação</h2>
              <p className="text-xs text-slate-500">
                Informe seu e-mail para receber as notificações e confirmação do atendimento pela plataforma.
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
            <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
              Resumo do Atendimento Barber-Now
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-500 block">Barbeiro Selecionado:</span>
                <span className="font-semibold text-slate-900">{selectedBarber?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Serviço:</span>
                <span className="font-semibold text-blue-600">{selectedService.name}</span> (R$ {selectedService.price})
              </div>
              <div>
                <span className="text-slate-500 block">Data e Hora:</span>
                <span className="font-semibold text-slate-900">
                  {selectedDate.split('-').reverse().join('/')} às {selectedTime}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Localização:</span>
                <span className="font-semibold text-slate-900">
                  {address.street}, {address.number} - {address.neighborhood}
                </span>
              </div>
            </div>
          </div>

          {/* User Account / Pre-cadastro Prompt */}
          {currentUser ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {currentUser.name}
                  </p>
                  <p className="text-slate-600">
                    {currentUser.email} {currentUser.phone ? `• ${currentUser.phone}` : ''}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                ✓ Conta Autenticada
              </span>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                    Identificação Obrigatória para Confirmar Agendamento
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Para garantir a segurança do atendimento e salvar o agendamento em seu histórico no banco de dados, é necessário entrar na sua conta ou criar um cadastro gratuito.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                >
                  Fazer Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register_client')}
                  className="px-4 py-2 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Criar Cadastro Gratuito
                </button>
              </div>
            </div>
          )}

          {/* Client Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Seu Nome Completo <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-client-name"
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Seu E-mail <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-client-email"
                  type="email"
                  required
                  placeholder="Ex: carlos.eduardo@email.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Observações para o Barbeiro (Opcional)
              </label>
              <input
                id="input-client-notes"
                type="text"
                placeholder="Ex: Levar máquina de cartão, tenho tomada próxima à cadeira, interfone 22"
                value={clientNotes}
                onChange={e => setClientNotes(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2 text-[11px] text-slate-500 flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Privacidade Barber-Now: O contato e as confirmações ocorrem estritamente via plataforma e por e-mail. Seus dados ficam salvos de forma segura no banco de dados.</span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full sm:w-auto text-center py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
            >
              ← Voltar para Escolha de Barbeiro
            </button>

            {currentUser ? (
              <button
                type="submit"
                id="btn-confirm-appointment"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirmar Agendamento</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-auth-to-confirm-appointment"
                onClick={() => openAuthModal('login')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar ou Cadastrar para Confirmar</span>
              </button>
            )}
          </div>
        </form>
      )}

      {/* Barber Detail Lightbox Modal */}
      <BarberDetailModal
        barber={previewBarber}
        onClose={() => setPreviewBarber(null)}
        onSelectBarber={handleSelectBarberFromGallery}
        isSelected={selectedBarber?.id === previewBarber?.id}
      />
    </div>
  );
};

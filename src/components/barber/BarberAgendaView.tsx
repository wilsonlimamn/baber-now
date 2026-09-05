import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Navigation,
  MessageSquare,
  AlertCircle,
  Plus,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useBarberNow } from '../../context/BarberNowContext.tsx';
import { AppointmentStatus } from '../../types.ts';
import { getTodayDateString, getOffsetDateString } from '../../data/initialData.ts';

export const BarberAgendaView: React.FC = () => {
  const {
    barbers,
    selectedBarberId,
    setSelectedBarberId,
    appointments,
    updateAppointmentStatus,
    neighborhoods,
    updateBarberNeighborhoods,
    addNeighborhood,
    setCurrentView,
  } = useBarberNow();

  // Active barber currently viewing the agenda
  const activeBarber = barbers.find(b => b.id === selectedBarberId) || barbers[0];

  // Selected date for agenda view
  const [activeDate, setActiveDate] = useState<string>(getTodayDateString());

  // Active tab inside barber view: 'agenda' | 'neighborhoods'
  const [activeSubTab, setActiveSubTab] = useState<'agenda' | 'neighborhoods'>('agenda');

  // Filter for appointment status
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New neighborhood input
  const [newNeighborhoodName, setNewNeighborhoodName] = useState('');
  const [newNeighborhoodRegion, setNewNeighborhoodRegion] = useState('Zona Oeste');

  if (!activeBarber) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-500">Nenhum barbeiro cadastrado no momento.</p>
        <button
          onClick={() => setCurrentView('barber_register')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer shadow-xs"
        >
          Cadastrar Primeiro Barbeiro
        </button>
      </div>
    );
  }

  // Filter appointments for this barber and selected date
  const barberAppointments = appointments.filter(apt => apt.barberId === activeBarber.id);

  const appointmentsForDate = barberAppointments.filter(apt => {
    const matchesDate = apt.date === activeDate;
    if (statusFilter === 'all') return matchesDate;
    return matchesDate && apt.status === statusFilter;
  });

  // Calculate day metrics
  const todayTotalRevenue = barberAppointments
    .filter(apt => apt.date === activeDate && apt.status !== 'cancelled')
    .reduce((sum, apt) => sum + apt.price, 0);

  const pendingRequestsCount = barberAppointments.filter(
    apt => apt.date === activeDate && apt.status === 'pending'
  ).length;

  const confirmedCount = barberAppointments.filter(
    apt => apt.date === activeDate && (apt.status === 'confirmed' || apt.status === 'on_the_way')
  ).length;

  // Toggle neighborhood support for active barber
  const handleToggleNeighborhood = (neighborhoodName: string) => {
    const current = activeBarber.neighborhoods;
    let updated: string[];
    if (current.includes(neighborhoodName)) {
      updated = current.filter(n => n !== neighborhoodName);
    } else {
      updated = [...current, neighborhoodName];
    }
    updateBarberNeighborhoods(activeBarber.id, updated);
  };

  const handleAddNewNeighborhood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNeighborhoodName.trim()) return;
    addNeighborhood(newNeighborhoodName.trim(), newNeighborhoodRegion, activeBarber.city);
    // Also attach to this barber
    if (!activeBarber.neighborhoods.includes(newNeighborhoodName.trim())) {
      updateBarberNeighborhoods(activeBarber.id, [...activeBarber.neighborhoods, newNeighborhoodName.trim()]);
    }
    setNewNeighborhoodName('');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            Nova Solicitação
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Confirmado
          </span>
        );
      case 'on_the_way':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            A Caminho (Deslocamento)
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Atendimento Concluído
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Cancelado
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Barber Profile Selector & Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Active Barber Profile Info */}
          <div className="flex items-center gap-3.5">
            <img
              src={activeBarber.avatar}
              alt={activeBarber.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600/30 shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{activeBarber.name}</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {activeBarber.experienceYears} anos exp.
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeBarber.phone} • Atende {activeBarber.neighborhoods.length} bairros em {activeBarber.city}
              </p>
            </div>
          </div>

          {/* Quick Barber Switcher (if multiple barbers exist) */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 self-start md:self-auto">
            <span className="text-xs text-slate-500 font-medium pl-1">Barbeiro:</span>
            <select
              id="select-active-barber"
              value={activeBarber.id}
              onChange={e => setSelectedBarberId(e.target.value)}
              className="bg-white text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600"
            >
              {barbers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.neighborhoods.length} bairros)
                </option>
              ))}
            </select>

            <button
              onClick={() => setCurrentView('barber_register')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Barbeiro</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation: Agenda vs Coverage Neighborhoods */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              id="btn-subtab-agenda"
              onClick={() => setActiveSubTab('agenda')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeSubTab === 'agenda'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Agenda por Dia & Hora</span>
              {barberAppointments.filter(a => a.status === 'pending').length > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {barberAppointments.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              id="btn-subtab-neighborhoods"
              onClick={() => setActiveSubTab('neighborhoods')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeSubTab === 'neighborhoods'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Bairros que Atendo ({activeBarber.neighborhoods.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-4">
            <span>
              Previsão do Dia: <strong className="text-blue-600 font-bold">R$ {todayTotalRevenue}</strong>
            </span>
            <span>
              Atendimentos: <strong className="text-slate-800 font-semibold">{confirmedCount} confirmados</strong>
            </span>
          </div>
        </div>
      </div>

      {/* VIEW: AGENDA */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-6">
          {/* Date Selector & Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-medium">Dia da Agenda:</span>

              <button
                type="button"
                id="agenda-date-today"
                onClick={() => setActiveDate(getTodayDateString())}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeDate === getTodayDateString()
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Hoje
              </button>

              <button
                type="button"
                id="agenda-date-tomorrow"
                onClick={() => setActiveDate(getOffsetDateString(1))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeDate === getOffsetDateString(1)
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Amanhã
              </button>

              <button
                type="button"
                id="agenda-date-plus2"
                onClick={() => setActiveDate(getOffsetDateString(2))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeDate === getOffsetDateString(2)
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                +2 Dias
              </button>

              {/* Specific Date input */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={activeDate}
                  onChange={e => setActiveDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filtrar:</span>
              <select
                id="select-status-filter"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-50 text-xs text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Apenas Pendentes</option>
                <option value="confirmed">Confirmados</option>
                <option value="on_the_way">A Caminho</option>
                <option value="completed">Concluídos</option>
              </select>
            </div>
          </div>

          {/* Pending Requests Alert Banner */}
          {pendingRequestsCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-800">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Você tem <strong>{pendingRequestsCount} solicitação(ões) pendente(s)</strong> aguardando sua confirmação para {activeDate.split('-').reverse().join('/')}!
                </span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700">Atenda com pontualidade</span>
            </div>
          )}

          {/* Appointments Timeline / Schedule List */}
          {appointmentsForDate.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
              <CalendarIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Nenhum atendimento agendado para esta data</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Não há cortes marcados para o dia {activeDate.split('-').reverse().join('/')}. Quando clientes dos seus bairros agendarem, as solicitações aparecerão aqui por hora.
              </p>
              <button
                onClick={() => setCurrentView('client')}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Testar Agendamento como Cliente
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointmentsForDate
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(apt => {
                  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${apt.address.street}, ${apt.address.number}, ${apt.address.neighborhood}, ${apt.address.city}`
                  )}`;

                  const cleanPhone = apt.clientPhone.replace(/\D/g, '');
                  const whatsAppUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                    `Olá ${apt.clientName}! Sou o barbeiro ${activeBarber.name} do Barber-Now referente ao seu atendimento de ${apt.serviceName} hoje às ${apt.time}.`
                  )}`;

                  return (
                    <div
                      key={apt.id}
                      id={`appointment-card-${apt.id}`}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition hover:border-slate-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        {/* Time & Service */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center shrink-0">
                            <Clock className="w-4 h-4 text-blue-600 mb-1" />
                            <span className="text-sm font-black text-slate-900 font-mono">{apt.time}</span>
                            <span className="text-[10px] text-slate-500">{apt.durationMin}m</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900">{apt.serviceName}</h3>
                              {getStatusBadge(apt.status)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <span>Cliente: <strong className="text-slate-800">{apt.clientName}</strong></span>
                              <span>•</span>
                              <span>Preço: <strong className="text-blue-600 font-bold">R$ {apt.price}</strong></span>
                            </div>
                            {apt.notes && (
                              <p className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 mt-2 max-w-xl">
                                💬 Observação do cliente: &quot;{apt.notes}&quot;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Direct Contacts & Maps */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition"
                            title="Abrir rota no Google Maps"
                          >
                            <Navigation className="w-3.5 h-3.5 text-blue-600" />
                            <span>Ver Rota / GPS</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>

                          <a
                            href={whatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs text-emerald-700 font-medium transition"
                            title="Conversar no WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp ({apt.clientPhone})</span>
                          </a>
                        </div>
                      </div>

                      {/* Address & Status Controls */}
                      <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Address detail */}
                        <div className="flex items-start gap-2 text-xs text-slate-600">
                          <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900">
                              {apt.address.street}, {apt.address.number}
                            </span>
                            {apt.address.complement && (
                              <span className="text-slate-500"> - {apt.address.complement}</span>
                            )}
                            <div className="text-slate-500">
                              Bairro: <strong className="text-slate-800">{apt.address.neighborhood}</strong> ({apt.address.city})
                              {apt.address.reference && ` • Ref: ${apt.address.reference}`}
                            </div>
                          </div>
                        </div>

                        {/* Action Status Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {apt.status === 'pending' && (
                            <>
                              <button
                                id={`btn-accept-${apt.id}`}
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Aceitar e Confirmar</span>
                              </button>

                              <button
                                id={`btn-reject-${apt.id}`}
                                onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5 text-slate-500" />
                                <span>Recusar</span>
                              </button>
                            </>
                          )}

                          {apt.status === 'confirmed' && (
                            <>
                              <button
                                id={`btn-on-the-way-${apt.id}`}
                                onClick={() => updateAppointmentStatus(apt.id, 'on_the_way')}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                              >
                                <Navigation className="w-3.5 h-3.5" />
                                <span>Iniciar Deslocamento (A Caminho)</span>
                              </button>

                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 cursor-pointer font-medium"
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          {apt.status === 'on_the_way' && (
                            <button
                              id={`btn-complete-${apt.id}`}
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Finalizar Corte (Concluído)</span>
                            </button>
                          )}

                          {apt.status === 'completed' && (
                            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Atendimento Finalizado</span>
                            </span>
                          )}

                          {apt.status === 'cancelled' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              Reativar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: COVERAGE NEIGHBORHOODS MANAGEMENT */}
      {activeSubTab === 'neighborhoods' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Bairros onde você tem disponibilidade de atender</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Marque os bairros que fazem sentido para sua rota diária. Clientes desses locais verão seu perfil na busca.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
                {activeBarber.neighborhoods.length} bairros ativos
              </span>
            </div>

            {/* Neighborhoods checkboxes grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {neighborhoods.map(item => {
                const isChecked = activeBarber.neighborhoods.includes(item.name);
                return (
                  <label
                    key={item.name}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-blue-50/70 border-blue-600 text-slate-900 font-semibold ring-1 ring-blue-600/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleNeighborhood(item.name)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="truncate">
                      <span className="block truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">{item.region}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Add Custom Neighborhood Form */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Não encontrou seu bairro? Adicionar novo:</span>
              </h3>

              <form onSubmit={handleAddNewNeighborhood} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                <input
                  type="text"
                  placeholder="Nome do Bairro (Ex: Vila Olímpia)"
                  value={newNeighborhoodName}
                  onChange={e => setNewNeighborhoodName(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400"
                />

                <select
                  value={newNeighborhoodRegion}
                  onChange={e => setNewNeighborhoodRegion(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="Zona Oeste">Zona Oeste</option>
                  <option value="Zona Sul">Zona Sul</option>
                  <option value="Zona Leste">Zona Leste</option>
                  <option value="Zona Norte">Zona Norte</option>
                  <option value="Central">Centro</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-xs"
                >
                  Adicionar Bairro
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

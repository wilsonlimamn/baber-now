import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Navigation,
  Mail,
  ShieldCheck,
  AlertCircle,
  Plus,
  ExternalLink,
  Map,
  Filter,
  DollarSign,
  UserCheck,
  Scissors,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useBarberNow } from '../../context/BarberNowContext.tsx';
import { AppointmentStatus } from '../../types.ts';
import { getTodayDateString, getOffsetDateString } from '../../data/initialData.ts';
import { BelemCoverageMap } from '../common/BelemCoverageMap.tsx';

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
    currentUser,
    openAuthModal,
  } = useBarberNow();

  // Se o usuário logado for barbeiro e tiver barberId correspondente, prioriza o perfil dele
  const effectiveBarberId = (currentUser?.role === 'barber' && currentUser.barberId)
    ? currentUser.barberId
    : selectedBarberId;

  const activeBarber = barbers.find(b => b.id === effectiveBarberId) || barbers[0];

  // Selected date for agenda view ('all_dates' ou 'YYYY-MM-DD')
  const [activeDate, setActiveDate] = useState<string>('all_dates');

  // Active tab inside barber dashboard: 'to_approve' | 'approved' | 'on_the_way' | 'all' | 'neighborhoods'
  const [activeTab, setActiveTab] = useState<'to_approve' | 'approved' | 'on_the_way' | 'all' | 'neighborhoods'>('to_approve');

  // Toggle map view for individual appointment
  const [expandedMapAptId, setExpandedMapAptId] = useState<string | null>(null);

  // Search input
  const [searchTerm, setSearchTerm] = useState('');

  // New neighborhood input
  const [newNeighborhoodName, setNewNeighborhoodName] = useState('');
  const [newNeighborhoodRegion, setNewNeighborhoodRegion] = useState('Centro');

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

  // Filter appointments for this barber
  const barberAppointments = appointments.filter(apt => apt.barberId === activeBarber.id);

  // Counters for tabs
  const pendingCount = barberAppointments.filter(apt => apt.status === 'pending').length;
  const approvedCount = barberAppointments.filter(apt => apt.status === 'confirmed').length;
  const onTheWayCount = barberAppointments.filter(apt => apt.status === 'on_the_way').length;
  const completedCount = barberAppointments.filter(apt => apt.status === 'completed').length;
  const totalCount = barberAppointments.length;

  // Total revenue from confirmed/completed
  const totalRevenue = barberAppointments
    .filter(apt => apt.status === 'confirmed' || apt.status === 'on_the_way' || apt.status === 'completed')
    .reduce((sum, apt) => sum + apt.price, 0);

  // Filtered appointments by tab & date & search
  const filteredAppointments = barberAppointments.filter(apt => {
    // Tab filter
    if (activeTab === 'to_approve' && apt.status !== 'pending') return false;
    if (activeTab === 'approved' && apt.status !== 'confirmed') return false;
    if (activeTab === 'on_the_way' && apt.status !== 'on_the_way') return false;
    // 'all' includes everything

    // Date filter
    if (activeDate !== 'all_dates' && apt.date !== activeDate) return false;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchClient = apt.clientName.toLowerCase().includes(term);
      const matchEmail = apt.clientEmail.toLowerCase().includes(term);
      const matchNeighborhood = apt.address.neighborhood.toLowerCase().includes(term);
      const matchService = apt.serviceName.toLowerCase().includes(term);
      if (!matchClient && !matchEmail && !matchNeighborhood && !matchService) return false;
    }

    return true;
  });

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
    if (!activeBarber.neighborhoods.includes(newNeighborhoodName.trim())) {
      updateBarberNeighborhoods(activeBarber.id, [...activeBarber.neighborhoods, newNeighborhoodName.trim()]);
    }
    setNewNeighborhoodName('');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Aguardando Aprovação</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Aprovado / Confirmado</span>
          </span>
        );
      case 'on_the_way':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-purple-600" />
            <span>A Caminho (Deslocamento)</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <Check className="w-3 h-3 text-slate-500" />
            <span>Concluído</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-500" />
            <span>Recusado / Cancelado</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-5">
      {/* Banner de Demonstração ou Boas-Vindas */}
      {currentUser?.role === 'barber' ? (
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4 rounded-2xl border border-blue-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <Scissors className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold leading-tight">
                  Olá, {currentUser.name}!
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  Barbeiro Conectado
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Seu Painel de Atendimentos em Belém-PA • Gerencie solicitações a aprovar e confirmadas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              {currentUser.email}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block text-sm">
                Visualização de Demonstração do Barbeiro ({activeBarber.name})
              </span>
              <p className="text-amber-800 text-xs">
                Para gerenciar agendamentos exclusivos da sua conta, faça seu pré-cadastro ou login na plataforma.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition cursor-pointer shadow-xs whitespace-nowrap"
            >
              Fazer Login
            </button>
            <button
              onClick={() => openAuthModal('register_barber')}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-semibold text-xs transition cursor-pointer whitespace-nowrap"
            >
              Pré-cadastrar Barbeiro
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card: A Aprovar */}
        <button
          type="button"
          onClick={() => setActiveTab('to_approve')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer shadow-xs ${
            activeTab === 'to_approve'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">A Aprovar</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              pendingCount > 0 ? 'bg-amber-500 text-white animate-bounce' : 'bg-slate-100 text-slate-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{pendingCount}</span>
            <span className="text-[11px] font-semibold text-amber-700">
              {pendingCount === 1 ? 'pendência' : 'pendências'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Aguardando sua confirmação</p>
        </button>

        {/* Card: Aprovados */}
        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer shadow-xs ${
            activeTab === 'approved'
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Aprovados</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{approvedCount}</span>
            <span className="text-[11px] font-semibold text-emerald-700">confirmados</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Prontos para atendimento</p>
        </button>

        {/* Card: Faturamento Previsto */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Faturamento</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-blue-600">R$</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{totalRevenue.toFixed(0)}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Confirmados e concluídos</p>
        </div>

        {/* Card: Bairros em Belém */}
        <button
          type="button"
          onClick={() => setActiveTab('neighborhoods')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer shadow-xs ${
            activeTab === 'neighborhoods'
              ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/30'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Cobertura Belém</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {activeBarber.neighborhoods.length}
            </span>
            <span className="text-[11px] font-semibold text-blue-700">bairros</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Gerenciar bairros atendidos</p>
        </button>
      </div>

      {/* Profile Row & Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={activeBarber.avatar}
            alt={activeBarber.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-blue-600/30 shadow-xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">{activeBarber.name}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {activeBarber.experienceYears} anos exp.
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {activeBarber.phone || 'Telefone não cadastrado'} • {activeBarber.neighborhoods.length} bairros em Belém-PA
            </p>
          </div>
        </div>

        {/* Troca Rápida de Barbeiro se não estiver amarrado a uma conta individual */}
        {!currentUser?.barberId && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto text-xs">
            <span className="text-slate-500 font-medium pl-1">Barbeiro:</span>
            <select
              id="select-active-barber-dashboard"
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
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-slate-900 p-1.5 rounded-2xl flex items-center justify-between overflow-x-auto gap-1 text-xs font-semibold select-none shadow-md">
        <div className="flex items-center gap-1 min-w-max">
          {/* Aba: A Aprovar */}
          <button
            id="tab-dashboard-to-approve"
            type="button"
            onClick={() => setActiveTab('to_approve')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'to_approve'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>A Aprovar</span>
            {pendingCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'to_approve' ? 'bg-slate-950 text-amber-400' : 'bg-red-500 text-white animate-pulse'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>

          {/* Aba: Aprovados */}
          <button
            id="tab-dashboard-approved"
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Aprovados ({approvedCount})</span>
          </button>

          {/* Aba: A Caminho */}
          {onTheWayCount > 0 && (
            <button
              id="tab-dashboard-on-the-way"
              type="button"
              onClick={() => setActiveTab('on_the_way')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'on_the_way'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>A Caminho ({onTheWayCount})</span>
            </button>
          )}

          {/* Aba: Todos / Histórico */}
          <button
            id="tab-dashboard-all"
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Todos ({totalCount})</span>
          </button>

          {/* Aba: Bairros */}
          <button
            id="tab-dashboard-neighborhoods"
            type="button"
            onClick={() => setActiveTab('neighborhoods')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'neighborhoods'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Bairros em Belém ({activeBarber.neighborhoods.length})</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR (When not on neighborhoods tab) */}
      {activeTab !== 'neighborhoods' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Date Selector */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="font-semibold text-slate-500 mr-1">Data:</span>
            <button
              type="button"
              onClick={() => setActiveDate('all_dates')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeDate === 'all_dates'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas as Datas
            </button>
            <button
              type="button"
              onClick={() => setActiveDate(getTodayDateString())}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeDate === getTodayDateString()
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => setActiveDate(getOffsetDateString(1))}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeDate === getOffsetDateString(1)
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Amanhã
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente ou bairro..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: APPOINTMENTS (to_approve, approved, on_the_way, all) */}
      {activeTab !== 'neighborhoods' && (
        <div className="space-y-4">
          {/* Specific Banner for "to_approve" */}
          {activeTab === 'to_approve' && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                <span>
                  <strong>Solicitações a Aprovar:</strong> Analise as informações de endereço e aprove para confirmar a ida até a residência do cliente.
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg shrink-0">
                {filteredAppointments.length} para aprovar
              </span>
            </div>
          )}

          {/* Specific Banner for "approved" */}
          {activeTab === 'approved' && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Atendimentos Aprovados:</strong> Quando estiver saindo para o local, clique em <em>&quot;Iniciar Deslocamento&quot;</em> para notificar o cliente.
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg shrink-0">
                {filteredAppointments.length} confirmados
              </span>
            </div>
          )}

          {/* Empty State */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">
                {activeTab === 'to_approve'
                  ? 'Nenhuma solicitação pendente de aprovação no momento!'
                  : activeTab === 'approved'
                  ? 'Nenhum corte aprovado para o filtro selecionado.'
                  : 'Nenhum agendamento encontrado.'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {activeTab === 'to_approve'
                  ? 'Excelente trabalho! Você já respondeu a todas as solicitações dos clientes.'
                  : 'Quando novos clientes agendarem nos seus bairros em Belém, os pedidos aparecerão aqui.'}
              </p>
              {activeTab === 'to_approve' && approvedCount > 0 && (
                <button
                  onClick={() => setActiveTab('approved')}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  Ver Agendamentos Aprovados ({approvedCount})
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredAppointments
                .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
                .map(apt => {
                  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${apt.address.street}, ${apt.address.number}, ${apt.address.neighborhood}, Belém - PA`
                  )}`;

                  return (
                    <div
                      key={apt.id}
                      id={`barber-apt-card-${apt.id}`}
                      className={`bg-white rounded-2xl p-4 sm:p-5 shadow-xs border transition ${
                        apt.status === 'pending'
                          ? 'border-amber-300 ring-1 ring-amber-200/50 bg-amber-50/20'
                          : apt.status === 'confirmed'
                          ? 'border-emerald-300/80'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Top Row: Service & Client */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                        <div className="flex items-start gap-3">
                          {/* Time Stamp */}
                          <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center shrink-0">
                            <Clock className="w-3.5 h-3.5 text-blue-600 mb-0.5" />
                            <span className="text-sm font-black text-slate-900 font-mono leading-none">
                              {apt.time}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                              {apt.date.split('-').reverse().slice(0, 2).join('/')}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900">{apt.serviceName}</h3>
                              {getStatusBadge(apt.status)}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                              <span>
                                Cliente: <strong className="text-slate-800">{apt.clientName}</strong>
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-slate-600">
                                <Mail className="w-3.5 h-3.5 text-blue-600 inline" />
                                <strong>{apt.clientEmail}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Preço: <strong className="text-blue-600 font-bold">R$ {apt.price}</strong> ({apt.durationMin}m)
                              </span>
                            </div>

                            {apt.notes && (
                              <p className="text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 mt-2 max-w-xl">
                                💬 Observação do cliente: &quot;{apt.notes}&quot;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Navigation & Platform Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setExpandedMapAptId(expandedMapAptId === apt.id ? null : apt.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                              expandedMapAptId === apt.id
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                            title="Visualizar mapa do bairro de Belém"
                          >
                            <Map className="w-3.5 h-3.5 text-blue-600" />
                            <span>{expandedMapAptId === apt.id ? 'Fechar Mapa' : 'Ver Mapa'}</span>
                          </button>

                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition"
                            title="Abrir rota no Google Maps"
                          >
                            <Navigation className="w-3.5 h-3.5 text-blue-600" />
                            <span>GPS Rota</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>

                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium"
                            title="Comunicação segura da plataforma Barber-Now"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Via Plataforma</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Address and Immediate Actions */}
                      <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Address detail */}
                        <div className="flex items-start gap-2 text-xs text-slate-600">
                          <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900">
                              {apt.address.street}, {apt.address.number}
                            </span>
                            {apt.address.complement && (
                              <span className="text-slate-500"> ({apt.address.complement})</span>
                            )}
                            <div className="text-slate-500">
                              Bairro: <strong className="text-slate-800">{apt.address.neighborhood}</strong> ({apt.address.city})
                              {apt.address.reference && ` • Ref: ${apt.address.reference}`}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Ações para PENDENTE (A Aprovar) */}
                          {apt.status === 'pending' && (
                            <>
                              <button
                                id={`btn-approve-${apt.id}`}
                                type="button"
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md hover:shadow-lg"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>✓ Aprovar Agendamento</span>
                              </button>

                              <button
                                id={`btn-reject-${apt.id}`}
                                type="button"
                                onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-xl text-xs font-medium transition cursor-pointer border border-slate-200"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Recusar</span>
                              </button>
                            </>
                          )}

                          {/* Ações para CONFIRMADO (Aprovado) */}
                          {apt.status === 'confirmed' && (
                            <>
                              <button
                                id={`btn-on-the-way-${apt.id}`}
                                type="button"
                                onClick={() => updateAppointmentStatus(apt.id, 'on_the_way')}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                              >
                                <Navigation className="w-3.5 h-3.5" />
                                <span>Iniciar Deslocamento (A Caminho)</span>
                              </button>

                              <button
                                id={`btn-complete-quick-${apt.id}`}
                                type="button"
                                onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-medium transition cursor-pointer border border-slate-200"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Concluir</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                className="text-xs text-slate-400 hover:text-red-600 px-2 py-1 cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          {/* Ações para A CAMINHO */}
                          {apt.status === 'on_the_way' && (
                            <button
                              id={`btn-complete-${apt.id}`}
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Finalizar Corte (Concluído)</span>
                            </button>
                          )}

                          {/* CONCLUÍDO */}
                          {apt.status === 'completed' && (
                            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Atendimento Finalizado</span>
                            </span>
                          )}

                          {/* CANCELADO */}
                          {apt.status === 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 underline cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reativar como Aprovado</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mapa do Atendimento */}
                      {expandedMapAptId === apt.id && (
                        <div className="mt-3.5 pt-3.5 border-t border-slate-100">
                          <BelemCoverageMap
                            neighborhood={apt.address.neighborhood}
                            street={apt.address.street}
                            number={apt.address.number}
                            city={apt.address.city}
                            showToggle={false}
                            defaultExpanded={true}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BAIRROS EM BELÉM */}
      {activeTab === 'neighborhoods' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Bairros de Belém que você atende</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Marque os bairros da sua rota de atendimento. Clientes desses locais encontrarão você na busca com disponibilidade imediata.
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
                <span>Adicionar outro bairro de Belém:</span>
              </h3>

              <form onSubmit={handleAddNewNeighborhood} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                <input
                  type="text"
                  placeholder="Nome do Bairro (Ex: Canudos, Montese)"
                  value={newNeighborhoodName}
                  onChange={e => setNewNeighborhoodName(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400"
                />

                <select
                  value={newNeighborhoodRegion}
                  onChange={e => setNewNeighborhoodRegion(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="Centro">Centro</option>
                  <option value="Centro-Sul">Centro-Sul</option>
                  <option value="Sul">Sul</option>
                  <option value="Norte">Norte</option>
                  <option value="Distrito de Icoaraci">Distrito de Icoaraci</option>
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

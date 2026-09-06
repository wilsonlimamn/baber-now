import React from 'react';
import { Calendar, UserCheck, Clock, Sparkles, LogIn, LogOut, User as UserIcon, Scissors } from 'lucide-react';
import { useBarberNow } from '../context/BarberNowContext.tsx';

interface HeaderProps {
  onOpenClientAppointments: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenClientAppointments }) => {
  const {
    currentView,
    setCurrentView,
    appointments,
    currentUser,
    openAuthModal,
    logout,
  } = useBarberNow();

  // Se o usuário logado for barbeiro, conta pendências dele
  const relevantAppointments = currentUser?.role === 'barber' && currentUser.barberId
    ? appointments.filter(a => a.barberId === currentUser.barberId)
    : appointments;

  const pendingCount = relevantAppointments.filter(a => a.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Desktop & Mobile Main Row */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => setCurrentView('client')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg sm:text-xl text-white shadow-sm transition group-hover:scale-105 shrink-0">
              B
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white leading-none">
                  Barber-Now
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
                Belém-PA • Em Domicílio
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile, shown on md+) */}
          <nav className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs lg:text-sm">
            <button
              id="nav-tab-client-desktop"
              onClick={() => setCurrentView('client')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'client'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Cliente</span>
            </button>

            <button
              id="nav-tab-barber-agenda-desktop"
              onClick={() => setCurrentView('barber_agenda')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer relative ${
                currentView === 'barber_agenda'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Dashboard Barbeiro</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                  {pendingCount} a aprovar
                </span>
              )}
            </button>

            <button
              id="nav-tab-register-barber-desktop"
              onClick={() => {
                if (!currentUser) {
                  openAuthModal('register_barber');
                } else {
                  setCurrentView('barber_register');
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'barber_register'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Seja Barbeiro</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* My Appointments for Client */}
            <button
              id="btn-client-appointments"
              onClick={onOpenClientAppointments}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium transition cursor-pointer"
              title="Meus Agendamentos de Corte"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">Meus Pedidos</span>
              <span className="sm:hidden text-[11px]">Pedidos</span>
            </button>

            {/* Auth Button or User Profile Pill */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl p-1 pl-2">
                <button
                  id="btn-user-profile-header"
                  onClick={() => {
                    if (currentUser.role === 'barber') {
                      setCurrentView('barber_agenda');
                    } else {
                      onOpenClientAppointments();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white transition cursor-pointer"
                  title="Acessar painel"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] text-white ${
                    currentUser.role === 'barber' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>
                    {currentUser.role === 'barber' ? (
                      <Scissors className="w-3.5 h-3.5" />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="font-semibold block leading-none truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {currentUser.role === 'barber' ? 'Barbeiro' : 'Cliente'}
                    </span>
                  </div>
                </button>

                <button
                  id="btn-logout-header"
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/60 transition cursor-pointer"
                  title="Sair da conta"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-open-login-header"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar (Visible only on mobile < md) */}
        <div className="md:hidden pb-2.5 pt-0.5 border-t border-slate-800/80">
          <nav className="grid grid-cols-3 gap-1 bg-slate-800/70 p-1 rounded-xl border border-slate-700/80 text-[11px]">
            <button
              id="nav-tab-client-mobile"
              onClick={() => setCurrentView('client')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'client'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
              <span className="truncate">Cliente</span>
            </button>

            <button
              id="nav-tab-barber-agenda-mobile"
              onClick={() => setCurrentView('barber_agenda')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg font-medium transition cursor-pointer relative ${
                currentView === 'barber_agenda'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="truncate">Dashboard</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0 animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-register-barber-mobile"
              onClick={() => {
                if (!currentUser) {
                  openAuthModal('register_barber');
                } else {
                  setCurrentView('barber_register');
                }
              }}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'barber_register'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3 shrink-0" />
              <span className="truncate">Cadastrar</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};


import React from 'react';
import { Scissors, Calendar, UserCheck, Smartphone, Monitor, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { useBarberNow } from '../context/BarberNowContext.tsx';

interface HeaderProps {
  onOpenClientAppointments: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenClientAppointments }) => {
  const {
    currentView,
    setCurrentView,
    isMobilePreview,
    setIsMobilePreview,
    appointments,
    resetDemoData,
  } = useBarberNow();

  const pendingCount = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo - Matching Professional Polish Badge */}
          <div
            id="brand-logo"
            onClick={() => setCurrentView('client')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm transition group-hover:scale-105">
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">Barber-Now</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Corte de Cabelo & Barba a Domicílio
              </p>
            </div>
          </div>

          {/* Navigation View Tabs */}
          <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs sm:text-sm">
            <button
              id="nav-tab-client"
              onClick={() => setCurrentView('client')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'client'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cliente</span>
            </button>

            <button
              id="nav-tab-barber-agenda"
              onClick={() => setCurrentView('barber_agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer relative ${
                currentView === 'barber_agenda'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda Barbeiro</span>
              {pendingCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-register-barber"
              onClick={() => setCurrentView('barber_register')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
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
          <div className="flex items-center gap-2">
            {/* My Appointments for Client */}
            <button
              id="btn-client-appointments"
              onClick={onOpenClientAppointments}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium transition cursor-pointer"
              title="Meus Agendamentos de Corte"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Meus Pedidos</span>
            </button>

            {/* Mobile / Web Device Frame Switcher */}
            <button
              id="btn-toggle-device-frame"
              onClick={() => setIsMobilePreview(!isMobilePreview)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition cursor-pointer"
              title={isMobilePreview ? 'Alternar para Modo Web Expandido' : 'Alternar para Modo App Celular'}
            >
              {isMobilePreview ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-[11px]">Modo Web</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px]">Ver como App</span>
                </>
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              id="btn-reset-demo"
              onClick={() => {
                if (window.confirm('Deseja restaurar os dados de demonstração com barbeiros e solicitações de exemplo?')) {
                  resetDemoData();
                }
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Restaurar dados demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { BarberNowProvider, useBarberNow } from './context/BarberNowContext.tsx';
import { Header } from './components/Header.tsx';
import { ClientBookingFlow } from './components/client/ClientBookingFlow.tsx';
import { BarberAgendaView } from './components/barber/BarberAgendaView.tsx';
import { BarberRegistrationForm } from './components/barber/BarberRegistrationForm.tsx';
import { ClientAppointmentsDrawer } from './components/client/ClientAppointmentsDrawer.tsx';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useBarberNow();
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'client':
        return (
          <ClientBookingFlow
            onBookingSuccess={() => {
              // Can optionally open client drawer or let them see confirmation screen
            }}
          />
        );
      case 'barber_agenda':
        return <BarberAgendaView />;
      case 'barber_register':
        return <BarberRegistrationForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header - Fully Responsive */}
      <Header onOpenClientAppointments={() => setIsClientDrawerOpen(true)} />

      {/* Main Container - Automatically responsive for mobile & desktop */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16">
        <div className="w-full max-w-full">
          {renderActiveView()}
        </div>
      </main>

      {/* Client Appointments Drawer */}
      <ClientAppointmentsDrawer
        isOpen={isClientDrawerOpen}
        onClose={() => setIsClientDrawerOpen(false)}
      />

      {/* Bottom Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-xs text-slate-400 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              B
            </div>
            <span className="text-white font-semibold">Barber-Now</span>
            <span className="text-slate-400 text-[11px] sm:text-xs">— Barbearia em Domicílio em Belém-PA</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
            <button
              onClick={() => setCurrentView('client')}
              className="hover:text-blue-400 cursor-pointer transition py-1"
            >
              Agendar Corte
            </button>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              onClick={() => setCurrentView('barber_agenda')}
              className="hover:text-blue-400 cursor-pointer transition py-1"
            >
              Agenda do Barbeiro
            </button>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              onClick={() => setCurrentView('barber_register')}
              className="hover:text-blue-400 cursor-pointer transition py-1"
            >
              Cadastrar Barbeiro
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            Barber-Now Belém-PA © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BarberNowProvider>
      <MainContent />
    </BarberNowProvider>
  );
}

import React, { useState } from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { BarberNowProvider, useBarberNow } from './context/BarberNowContext.tsx';
import { Header } from './components/Header.tsx';
import { ClientBookingFlow } from './components/client/ClientBookingFlow.tsx';
import { BarberAgendaView } from './components/barber/BarberAgendaView.tsx';
import { BarberRegistrationForm } from './components/barber/BarberRegistrationForm.tsx';
import { ClientAppointmentsDrawer } from './components/client/ClientAppointmentsDrawer.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { EmailTestModal } from './components/common/EmailTestModal.tsx';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useBarberNow();
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'client':
        return (
          <ClientBookingFlow
            onBookingSuccess={() => {
              // Can optionally open client drawer or let them see confirmation screen
            }}
            onOpenClientAppointments={() => setIsClientDrawerOpen(true)}
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

      {/* Auth Modal (Login / Pré-cadastro Cliente / Pré-cadastro Barbeiro) */}
      <AuthModal />

      {/* Modal de Teste de E-mails via site3facil@gmail.com */}
      <EmailTestModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />

      {/* Bottom Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-7 px-4 text-xs text-slate-400 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                B
              </div>
              <span className="text-white font-semibold text-sm">Barber-Now Belém</span>
              <span className="text-slate-400 text-[11px] sm:text-xs hidden sm:inline">— Barbearia em Domicílio</span>
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
              <span className="text-slate-700 hidden sm:inline">•</span>
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-slate-700 font-medium transition cursor-pointer"
                title="Testar envio de e-mails de confirmação via site3facil@gmail.com"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Testar E-mails (site3facil@gmail.com)</span>
              </button>
            </div>
          </div>

          {/* Linha de Produção 3facil.com e Copyright */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center sm:text-left">
            <div>
              Barber-Now Belém-PA © {new Date().getFullYear()} • Todos os direitos reservados.
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-xs">
              <span className="text-slate-400">Site produzido por</span>
              <a
                href="https://3facil.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1 underline underline-offset-2"
              >
                3facil.com
                <ExternalLink className="w-3 h-3 inline-block" />
              </a>
              <span className="text-slate-500 mx-1">|</span>
              <span className="text-slate-400 text-[10px] font-mono">site3facil@gmail.com</span>
            </div>
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

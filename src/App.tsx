import React, { useState } from 'react';
import { BarberNowProvider, useBarberNow } from './context/BarberNowContext.tsx';
import { Header } from './components/Header.tsx';
import { ClientBookingFlow } from './components/client/ClientBookingFlow.tsx';
import { BarberAgendaView } from './components/barber/BarberAgendaView.tsx';
import { BarberRegistrationForm } from './components/barber/BarberRegistrationForm.tsx';
import { ClientAppointmentsDrawer } from './components/client/ClientAppointmentsDrawer.tsx';
import { AppMobileBanner } from './components/ui/AppMobileBanner.tsx';
import { Scissors, Sparkles, MapPin, Calendar, Smartphone, ShieldCheck, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, isMobilePreview } = useBarberNow();
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header onOpenClientAppointments={() => setIsClientDrawerOpen(true)} />

      {/* PWA / Mobile Informational Banner */}
      <AppMobileBanner />

      {/* Main Container or Mobile Device Frame Simulator */}
      <main className="flex-1 pb-16">
        {isMobilePreview ? (
          <div className="py-8 px-4 flex justify-center items-center">
            {/* Phone Bezel Simulator */}
            <div className="w-full max-w-[420px] bg-slate-900 border-4 border-slate-700 rounded-[44px] p-3.5 shadow-2xl ring-8 ring-slate-800/60">
              {/* Phone Speaker & Dynamic Island */}
              <div className="w-32 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-800 mr-2" />
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Screen Area */}
              <div className="bg-slate-50 rounded-[32px] overflow-y-auto max-h-[720px] p-2 border border-slate-200 scrollbar-thin text-slate-900">
                {renderActiveView()}
              </div>

              {/* Home indicator bar */}
              <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-3" />
            </div>
          </div>
        ) : (
          <div className="transition-all duration-200">
            {renderActiveView()}
          </div>
        )}
      </main>

      {/* Client Appointments Drawer */}
      <ClientAppointmentsDrawer
        isOpen={isClientDrawerOpen}
        onClose={() => setIsClientDrawerOpen(false)}
      />

      {/* Bottom Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              B
            </div>
            <span className="text-white font-semibold">Barber-Now</span>
            <span className="text-slate-400">— Plataforma de Corte de Cabelo & Barba a Domicílio</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <button
              onClick={() => setCurrentView('client')}
              className="hover:text-blue-400 cursor-pointer transition"
            >
              Agendar Corte
            </button>
            <button
              onClick={() => setCurrentView('barber_agenda')}
              className="hover:text-blue-400 cursor-pointer transition"
            >
              Agenda do Barbeiro
            </button>
            <button
              onClick={() => setCurrentView('barber_register')}
              className="hover:text-blue-400 cursor-pointer transition"
            >
              Cadastrar Barbeiro
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            Node.js & Express Architecture • Barber-Now © {new Date().getFullYear()}
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

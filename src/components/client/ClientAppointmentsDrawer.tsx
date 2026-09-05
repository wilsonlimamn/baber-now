import React from 'react';
import { X, Clock, MapPin, Scissors, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBarberNow } from '../../context/BarberNowContext.tsx';
import { AppointmentStatus } from '../../types.ts';

interface ClientAppointmentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientAppointmentsDrawer: React.FC<ClientAppointmentsDrawerProps> = ({ isOpen, onClose }) => {
  const { appointments, updateAppointmentStatus } = useBarberNow();

  if (!isOpen) return null;

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Aguardando Barbeiro
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Confirmado pelo Barbeiro
          </span>
        );
      case 'on_the_way':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 animate-pulse">
            Barbeiro a Caminho!
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Corte Concluído
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Cancelado
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs transition">
      <div className="w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Meus Pedidos de Corte</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <p>Nenhum agendamento realizado ainda.</p>
              <p className="text-xs text-slate-500 mt-1">Preencha o formulário para agendar seu primeiro corte.</p>
            </div>
          ) : (
            appointments.map(apt => {
              const cleanPhone = apt.barberPhone.replace(/\D/g, '');
              const whatsAppUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                `Olá ${apt.barberName}! Gostaria de falar sobre o agendamento de ${apt.serviceName} marcado para ${apt.date.split('-').reverse().join('/')} às ${apt.time}.`
              )}`;

              return (
                <div
                  key={apt.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-3 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400">#{apt.id}</span>
                      <h3 className="font-bold text-sm text-slate-900">{apt.serviceName}</h3>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {apt.date.split('-').reverse().join('/')} às <strong className="text-slate-900">{apt.time}</strong>
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        {apt.address.street}, {apt.address.number} - {apt.address.neighborhood}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <img
                        src={apt.barberAvatar}
                        alt={apt.barberName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span>Barbeiro: <strong className="text-slate-800">{apt.barberName}</strong></span>
                      <span className="text-blue-600 font-bold ml-auto">R$ {apt.price}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp do Barbeiro</span>
                    </a>

                    {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
                            updateAppointmentStatus(apt.id, 'cancelled');
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 text-xs font-medium transition cursor-pointer"
                      >
                        Cancelar Pedido
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

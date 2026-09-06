import React from 'react';
import { X, Star, MapPin, Phone, Award, Clock, Scissors, ShieldCheck, Check } from 'lucide-react';
import { Barber } from '../../types.ts';

interface BarberDetailModalProps {
  barber: Barber | null;
  onClose: () => void;
  onSelectBarber: (barber: Barber) => void;
  isSelected: boolean;
}

export const BarberDetailModal: React.FC<BarberDetailModalProps> = ({
  barber,
  onClose,
  onSelectBarber,
  isSelected,
}) => {
  if (!barber) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Barber Photo Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 shrink-0">
          <img
            src={barber.avatar}
            alt={barber.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* Verification Badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-sm backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Barbeiro Verificado Barber-Now</span>
          </div>

          {/* Bottom Photo Overlay Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">{barber.name}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {barber.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{barber.reviewsCount} avaliações</span>
                  <span>•</span>
                  <span className="text-blue-300 font-semibold">{barber.experienceYears} anos de experiência</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          {/* Bio & Specialty */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-blue-600" />
              <span>Sobre o Profissional</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {barber.bio}
            </p>
          </div>

          {/* Quick info cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Horário de Atendimento</span>
                <span className="text-slate-800 font-bold">
                  {barber.workingHours.start} às {barber.workingHours.end}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Canal de Atendimento</span>
                <span className="text-slate-800 font-bold">Plataforma Barber-Now</span>
              </div>
            </div>
          </div>

          {/* Coverage Neighborhoods */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Bairros que {barber.name.split(' ')[0]} atende em domicílio:</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {barber.neighborhoods.map(nb => (
                <span
                  key={nb}
                  className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-medium"
                >
                  {nb}
                </span>
              ))}
            </div>
          </div>

          {/* Quality Standards */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Garantia de Qualidade Barber-Now</span>
            </div>
            <p className="text-[11px] text-slate-500">
              O profissional leva maleta completa esterilizada, toalhas higienizadas, lâminas descartáveis de uso único e deixa seu ambiente limpo após o corte.
            </p>
          </div>
        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectBarber(barber);
              onClose();
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm ${
              isSelected
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                <span>Barbeiro Selecionado</span>
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Agendar com {barber.name.split(' ')[0]}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

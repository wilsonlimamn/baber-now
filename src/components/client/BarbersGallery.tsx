import React, { useState } from 'react';
import {
  Star,
  MapPin,
  ShieldCheck,
  Check,
  Eye,
  Scissors,
  Sparkles,
  Users
} from 'lucide-react';
import { Barber } from '../../types.ts';

interface BarbersGalleryProps {
  barbers: Barber[];
  selectedNeighborhood: string;
  selectedBarber: Barber | null;
  onSelectBarber: (barber: Barber) => void;
  onOpenBarberModal: (barber: Barber) => void;
}

export const BarbersGallery: React.FC<BarbersGalleryProps> = ({
  barbers,
  selectedNeighborhood,
  selectedBarber,
  onSelectBarber,
  onOpenBarberModal,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'neighborhood'>('all');

  const neighborhoodBarbers = barbers.filter(b =>
    b.neighborhoods.some(n => n.toLowerCase() === selectedNeighborhood.toLowerCase())
  );

  const displayedBarbers = filterTab === 'neighborhood' ? neighborhoodBarbers : barbers;

  return (
    <section className="mt-8 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Nossos Barbeiros Parceiros
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {barbers.length} profissionais
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fotos e perfis dos especialistas credenciados que atendem no conforto da sua residência ou trabalho.
            </p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({barbers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('neighborhood')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 ${
              filterTab === 'neighborhood'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3 h-3 text-blue-600" />
            <span>Em {selectedNeighborhood} ({neighborhoodBarbers.length})</span>
          </button>
        </div>
      </div>

      {/* Barbers Grid */}
      {displayedBarbers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <p className="text-sm font-semibold text-slate-700">
            Nenhum barbeiro atende exclusivamente &quot;{selectedNeighborhood}&quot; no momento.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Veja a lista completa de profissionais ou selecione um bairro vizinho.
          </p>
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className="mt-3 text-xs px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition cursor-pointer"
          >
            Mostrar Todos os {barbers.length} Barbeiros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {displayedBarbers.map(barber => {
            const isSelected = selectedBarber?.id === barber.id;
            const servesCurrentNeighborhood = barber.neighborhoods.some(
              n => n.toLowerCase() === selectedNeighborhood.toLowerCase()
            );

            return (
              <div
                key={barber.id}
                id={`barber-showcase-${barber.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs flex flex-col justify-between group ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Photo with Overlay Info */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Disponível</span>
                      </span>

                      {servesCurrentNeighborhood && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                          <Check className="w-3 h-3" />
                          <span>Atende seu bairro</span>
                        </span>
                      )}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{barber.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({barber.reviewsCount})</span>
                    </div>

                    {/* View Photo Action button */}
                    <button
                      type="button"
                      onClick={() => onOpenBarberModal(barber)}
                      className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs transition cursor-pointer flex items-center gap-1 text-xs font-medium"
                      title="Ver foto em tamanho real e perfil completo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ver Perfil</span>
                    </button>

                    {/* Name & Experience in Photo Overlay */}
                    <div className="absolute bottom-3 left-3 text-white max-w-[70%]">
                      <span className="text-[11px] font-semibold text-blue-200">
                        {barber.experienceYears} anos de experiência
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-xs">
                        {barber.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {barber.bio}
                    </p>

                    {/* Neighborhoods Tags */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                        <span>Bairros de atendimento:</span>
                        <span className="text-slate-500">{barber.city}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {barber.neighborhoods.slice(0, 4).map(nb => {
                          const isMatch = nb.toLowerCase() === selectedNeighborhood.toLowerCase();
                          return (
                            <span
                              key={nb}
                              className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition ${
                                isMatch
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300 font-bold'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {nb}
                            </span>
                          );
                        })}
                        {barber.neighborhoods.length > 4 && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                            +{barber.neighborhoods.length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => onOpenBarberModal(barber)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer underline transition"
                  >
                    Mais detalhes
                  </button>

                  <button
                    type="button"
                    id={`btn-choose-barber-${barber.id}`}
                    onClick={() => onSelectBarber(barber)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Barbeiro Escolhido</span>
                      </>
                    ) : (
                      <>
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Escolher Barbeiro</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

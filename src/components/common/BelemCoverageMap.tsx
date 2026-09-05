import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, ExternalLink, ShieldCheck, Eye, EyeOff, Layers } from 'lucide-react';

export const BELEM_NEIGHBORHOOD_COORDS: Record<string, { lat: number; lon: number; region: string }> = {
  'Nazaré': { lat: -1.4528, lon: -48.4827, region: 'Centro' },
  'Batista Campos': { lat: -1.4589, lon: -48.4908, region: 'Centro' },
  'Campina': { lat: -1.4545, lon: -48.4998, region: 'Centro' },
  'Cidade Velha': { lat: -1.4558, lon: -48.5042, region: 'Centro' },
  'Reduto': { lat: -1.4490, lon: -48.4950, region: 'Centro' },
  'Umarizal': { lat: -1.4425, lon: -48.4851, region: 'Centro-Sul' },
  'Marco': { lat: -1.4312, lon: -48.4614, region: 'Centro-Sul' },
  'Souza': { lat: -1.4190, lon: -48.4420, region: 'Centro-Sul' },
  'Pedreira': { lat: -1.4243, lon: -48.4735, region: 'Sul' },
  'Telégrafo': { lat: -1.4350, lon: -48.4920, region: 'Sul' },
  'Guamá': { lat: -1.4680, lon: -48.4650, region: 'Sul' },
  'Jurunas': { lat: -1.4720, lon: -48.4950, region: 'Sul' },
  'Marambaia': { lat: -1.3980, lon: -48.4410, region: 'Sul' },
  'Sacramenta': { lat: -1.4180, lon: -48.4850, region: 'Norte' },
  'Val-de-Cans': { lat: -1.3850, lon: -48.4760, region: 'Norte' },
  'Icoaraci': { lat: -1.3000, lon: -48.4850, region: 'Distrito de Icoaraci' },
};

interface BelemCoverageMapProps {
  neighborhood: string;
  street?: string;
  number?: string;
  city?: string;
  availableBarbersCount?: number;
  showToggle?: boolean;
  defaultExpanded?: boolean;
}

export const BelemCoverageMap: React.FC<BelemCoverageMapProps> = ({
  neighborhood,
  street = '',
  number = '',
  city = 'Belém',
  availableBarbersCount = 0,
  showToggle = true,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [zoomMode, setZoomMode] = useState<'bairro' | 'belem'>('bairro');

  // Coordenadas centrais do bairro selecionado ou Belém geral
  const coords = useMemo(() => {
    const found = BELEM_NEIGHBORHOOD_COORDS[neighborhood];
    if (found) return found;
    // Default: Centro de Belém (Praça da República / Nazaré)
    return { lat: -1.4528, lon: -48.4827, region: 'Centro' };
  }, [neighborhood]);

  // Monta a bounding box do OpenStreetMap
  const embedUrl = useMemo(() => {
    const delta = zoomMode === 'bairro' ? 0.009 : 0.055;
    const minLon = (coords.lon - delta).toFixed(5);
    const minLat = (coords.lat - delta).toFixed(5);
    const maxLon = (coords.lon + delta).toFixed(5);
    const maxLat = (coords.lat + delta).toFixed(5);
    const markerLat = coords.lat.toFixed(5);
    const markerLon = coords.lon.toFixed(5);

    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${markerLat}%2C${markerLon}`;
  }, [coords, zoomMode]);

  // Query para navegação no Google Maps e Waze
  const fullAddressQuery = useMemo(() => {
    const parts = [
      street.trim(),
      number.trim(),
      neighborhood,
      'Belém',
      'PA',
    ].filter(Boolean);
    return encodeURIComponent(parts.join(', '));
  }, [street, number, neighborhood]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${fullAddressQuery}`;
  const wazeUrl = `https://waze.com/ul?q=${fullAddressQuery}`;

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs transition-all">
      {/* Header do Mapa */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Cobertura em {neighborhood} ({coords.region} - {city})
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                Atendimento Domiciliar
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {availableBarbersCount > 0
                ? `${availableBarbersCount} barbeiro(s) disponível(is) para deslocamento neste bairro`
                : `Verificando rota de atendimento para ${neighborhood}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Alternar zoom */}
          {isExpanded && (
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setZoomMode('bairro')}
                className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                  zoomMode === 'bairro'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bairro
              </button>
              <button
                type="button"
                onClick={() => setZoomMode('belem')}
                className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                  zoomMode === 'belem'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belém Geral
              </button>
            </div>
          )}

          {/* Botão de Expandir/Recolher */}
          {showToggle && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Ocultar</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Mapa</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo do Mapa */}
      {isExpanded && (
        <div className="relative">
          {/* Iframe OpenStreetMap 100% Gratuito, Sem API Key, Ultra Leve */}
          <div className="w-full h-56 sm:h-64 bg-slate-100 relative">
            <iframe
              title={`Mapa de Belém - ${neighborhood}`}
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
            {/* Overlay badge no topo do mapa */}
            <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs border border-slate-200 shadow-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-700 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Ponto de Chegada: <strong>{neighborhood}</strong></span>
            </div>
          </div>

          {/* Rodapé do Mapa com Atalhos de GPS */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px]">
                {street ? `${street}${number ? `, ${number}` : ''} - ${neighborhood}` : `Região de ${neighborhood}, Belém - PA`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">|</span>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                <span>Waze</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

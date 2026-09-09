import React, { useEffect, useState } from 'react';
import { Scissors, Sparkles } from 'lucide-react';

interface AppSplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({ 
  onFinish, 
  minDuration = 1400 
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Simula carregamento fluido dos dados e recursos do app
    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(pInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20 + 15);
      });
    }, 180);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 400); // Duração do fade out
    }, minDuration);

    return () => {
      clearInterval(pInterval);
      clearTimeout(timer);
    };
  }, [minDuration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-900 transition-opacity duration-400 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 70%, #f1f5f9 100%)',
      }}
    >
      {/* Círculo de Brilho Suave Azul no Fundo */}
      <div className="absolute w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Ícone Central Tesoura e Pente Azul com Fundo Branco */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Aro Azul Rotativo Suave */}
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-400/50 animate-[spin_8s_linear_infinite]" />

        {/* Círculo Central com Ícone */}
        <div className="absolute w-24 h-24 rounded-full bg-white border-2 border-blue-600 flex flex-col items-center justify-center shadow-xl shadow-blue-500/15">
          <div className="relative">
            {/* Tesoura Cruzada com Pente em Tons de Azul Profissional */}
            <svg
              viewBox="0 0 100 100"
              className="w-14 h-14 drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pente Azul Médio */}
              <g transform="rotate(-30 50 50)">
                <rect x="25" y="44" width="50" height="7" rx="2" fill="#2563EB" />
                <rect x="28" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="32" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="36" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="40" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="44" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="48" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="52" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="56" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="60" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="64" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
                <rect x="68" y="51" width="2" height="12" rx="1" fill="#3B82F6" />
              </g>

              {/* Tesoura em Azul Escuro e Azul Real */}
              <circle cx="34" cy="74" r="8" stroke="#1D4ED8" strokeWidth="2.8" />
              <path d="M39 68 L50 54" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round" />
              <path d="M50 54 L76 25" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" />

              <circle cx="66" cy="74" r="8" stroke="#0284C7" strokeWidth="2.8" />
              <path d="M61 68 L50 54" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              <path d="M50 54 L24 25" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />

              {/* Pino Central */}
              <circle cx="50" cy="54" r="3.5" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Título e Subtítulo da Marca */}
      <div className="text-center z-10 px-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase text-blue-600">
          BARBER-NOW
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 tracking-wide">
          Barbeiros em Domicílio • Belém - PA
        </p>
      </div>

      {/* Barra de Progresso em Azul Barber-Now */}
      <div className="w-56 mt-7">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-medium">
          <span>Iniciando...</span>
          <span className="text-blue-600 font-bold">{progress}%</span>
        </div>
      </div>

      {/* Rodapé da Empresa 3fácil */}
      <div className="absolute bottom-6 text-center text-[11px] text-slate-400">
        <span>Produzido por </span>
        <span className="text-blue-600 font-semibold">3facil.com</span>
      </div>
    </div>
  );
};

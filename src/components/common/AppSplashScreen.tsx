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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-400 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 60%, #020617 100%)',
      }}
    >
      {/* Círculo de Brilho de Fundo */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Ícone Central Tesoura e Pente com Efeito de Pulso */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Aro Dourado Rotativo Suave */}
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-500/40 animate-[spin_8s_linear_infinite]" />

        {/* Círculo Central com Ícone */}
        <div className="absolute w-24 h-24 rounded-full bg-slate-900/90 border-2 border-amber-500 flex flex-col items-center justify-center shadow-2xl shadow-amber-500/20">
          <div className="relative">
            {/* Tesoura Cruzada com Pente em SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-14 h-14 text-amber-400 drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pente Dourado */}
              <g transform="rotate(-30 50 50)">
                <rect x="25" y="44" width="50" height="7" rx="2" fill="#F59E0B" />
                <rect x="28" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="32" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="36" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="40" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="44" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="48" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="52" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="56" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="60" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="64" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
                <rect x="68" y="51" width="2" height="12" rx="1" fill="#FDE68A" />
              </g>

              {/* Tesoura em Aço Inox / Branco */}
              <circle cx="34" cy="74" r="8" stroke="#FFFFFF" strokeWidth="2.5" />
              <path d="M39 68 L50 54" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <path d="M50 54 L76 25" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />

              <circle cx="66" cy="74" r="8" stroke="#E2E8F0" strokeWidth="2.5" />
              <path d="M61 68 L50 54" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
              <path d="M50 54 L24 25" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" />

              {/* Pino Central */}
              <circle cx="50" cy="54" r="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Título e Subtítulo da Marca */}
      <div className="text-center z-10 px-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400">
          BARBER-NOW
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1 tracking-wide">
          Barbeiros em Domicílio • Belém - PA
        </p>
      </div>

      {/* Barra de Progresso com Barber Pole Style */}
      <div className="w-56 mt-7">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
          <span>Iniciando...</span>
          <span className="text-amber-400 font-semibold">{progress}%</span>
        </div>
      </div>

      {/* Rodapé da Empresa 3fácil */}
      <div className="absolute bottom-6 text-center text-[11px] text-slate-400">
        <span>Produzido por </span>
        <span className="text-slate-300 font-semibold">3facil.com</span>
      </div>
    </div>
  );
};

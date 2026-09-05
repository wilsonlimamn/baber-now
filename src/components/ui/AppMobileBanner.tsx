import React, { useState } from 'react';
import { Smartphone, Download, Check, X, Shield, Sparkles } from 'lucide-react';

export const AppMobileBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  if (!isVisible) return null;

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="bg-slate-100/90 border-b border-slate-200 py-2.5 px-4 text-xs text-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong className="text-slate-900 font-semibold">Barber-Now App:</strong> Interface moderna e responsiva para clientes agendarem em casa e barbeiros gerenciarem rotas em tempo real.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 text-[11px] font-medium shadow-xs transition cursor-pointer"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Download className="w-3 h-3 text-blue-600" />}
            <span>{isCopied ? 'Link Copiado!' : 'Abrir no Celular'}</span>
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition"
            title="Fechar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

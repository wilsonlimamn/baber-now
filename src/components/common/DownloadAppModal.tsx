import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/barber-now.apk`
    : 'https://barbernow.3facil.com/barber-now.apk';

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    downloadUrl
  )}&margin=10`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-white">
        {/* Header com Gradiente */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Aplicativo Android Oficial
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                Baixar Barber-Now
              </h2>
            </div>
          </div>
          <p className="text-blue-100 text-xs sm:text-sm">
            Tenha a melhor barbearia em domicílio de Belém-PA direto na tela inicial do seu celular.
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Botão de Download Principal */}
          <div className="space-y-3">
            <a
              href="/barber-now.apk"
              download="barber-now.apk"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer text-sm sm:text-base group"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              <span>Baixar APK para Android (.apk)</span>
            </a>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Livre de vírus • 100% Seguro
              </span>
              <span>Versão 1.0.0 • ~4.2 MB</span>
            </div>
          </div>

          {/* QR Code para baixar pelo celular se estiver no computador */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-2 rounded-lg shrink-0 shadow-md">
              <img
                src={qrCodeUrl}
                alt="QR Code para baixar Barber-Now"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
              />
            </div>
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-200">
                <QrCode className="w-4 h-4 text-blue-400" />
                <span>Está no computador?</span>
              </div>
              <p className="text-xs text-slate-300">
                Aponte a câmera do seu celular Android para o QR Code para baixar o app diretamente no aparelho.
              </p>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 transition cursor-pointer font-medium mt-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar link de download</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Passo a Passo de Instalação */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Como instalar no seu celular em 3 passos:
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Baixe o arquivo</p>
                  <p className="text-slate-400 text-[11px]">
                    Clique no botão azul acima para iniciar o download do arquivo <code>barber-now.apk</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Abra a notificação</p>
                  <p className="text-slate-400 text-[11px]">
                    Quando terminar, toque na notificação do download no topo da tela do celular para abrir o instalador.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Confirme a instalação</p>
                  <p className="text-slate-400 text-[11px]">
                    Se o Android perguntar sobre "Fontes Desconhecidas", clique em <strong>Configurações</strong> e ative <strong>Permitir desta fonte</strong>. Depois toque em <strong>Instalar</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/80 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Barber-Now • Belém-PA</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

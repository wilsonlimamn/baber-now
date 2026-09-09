import React from 'react';
import { Download, RefreshCw, CheckCircle2, X, Sparkles, AlertCircle } from 'lucide-react';
import { AppVersionInfo, CURRENT_CLIENT_VERSION } from '../../services/updateService.ts';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateInfo: AppVersionInfo | null;
  isNativeApp: boolean;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  updateInfo,
  isNativeApp,
}) => {
  if (!isOpen || !updateInfo) return null;

  const handleUpdateClick = () => {
    if (isNativeApp) {
      // No App Android: abre o link direto para download e instalação do APK
      window.open(updateInfo.apkDownloadUrl || '/barber-now.apk', '_system');
    } else {
      // No Navegador Web: força limpeza de cache e recarrega a página com a versão mais recente
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-md w-full overflow-hidden transition-all transform scale-100">
        {/* Cabeçalho com Gradiente Azul Barber-Now */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-5 text-white relative">
          {!updateInfo.forceUpdate && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">
                Nova Atualização
              </span>
              <h3 className="text-lg font-black tracking-wide leading-tight">
                Barber-Now v{updateInfo.version}
              </h3>
            </div>
          </div>
          <p className="text-xs text-blue-100">
            {isNativeApp
              ? 'Uma nova versão do aplicativo Android está disponível para instalação.'
              : 'Uma nova versão do sistema web foi implantada no servidor.'}
          </p>
        </div>

        {/* Corpo com Detalhes e Changelog */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs p-3 bg-blue-50/60 rounded-xl border border-blue-100">
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">Sua Versão</span>
              <span className="font-semibold text-slate-700">v{CURRENT_CLIENT_VERSION}</span>
            </div>
            <div className="text-right">
              <span className="text-blue-500 block text-[10px] font-medium">Nova Versão</span>
              <span className="font-bold text-blue-700">v{updateInfo.version}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              O que mudou nesta versão:
            </h4>
            <ul className="space-y-2">
              {updateInfo.changelog?.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleUpdateClick}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isNativeApp ? (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar Atualização (.APK)</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Recarregar e Atualizar</span>
                </>
              )}
            </button>

            {!updateInfo.forceUpdate && (
              <button
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition cursor-pointer text-center"
              >
                Lembrar Mais Tarde
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

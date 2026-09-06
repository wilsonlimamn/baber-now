import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2, Send, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { api } from '../../services/api.ts';
import { useBarberNow } from '../../context/BarberNowContext.tsx';

interface EmailTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailTestModal: React.FC<EmailTestModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useBarberNow();
  const [recipient, setRecipient] = useState(currentUser?.email || 'site3facil@gmail.com');
  const [testType, setTestType] = useState<'registration' | 'booking'>('registration');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    details?: any;
    error?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !recipient.includes('@')) {
      alert('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.sendTestEmail({
        to: recipient.trim(),
        type: testType,
      });
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        error: err?.message || 'Erro inesperado ao disparar teste de e-mail.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Central de Teste de E-mails</h3>
              <p className="text-xs text-slate-400">Disparado via site3facil@gmail.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Remetente & Produção */}
          <div className="p-3.5 bg-blue-50 border border-blue-200/80 rounded-xl space-y-2 text-xs text-blue-900">
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5 text-blue-950">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Remetente Oficial Configurado:
              </span>
              <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                site3facil@gmail.com
              </span>
            </div>
            <div className="text-[11px] text-blue-700 flex items-center justify-between pt-1 border-t border-blue-200/60">
              <span>Produzido por <strong>3facil.com</strong></span>
              <a
                href="https://3facil.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-0.5 underline"
              >
                3facil.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                E-mail Destinatário do Teste
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                placeholder="exemplo@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Você pode usar seu próprio e-mail para receber a notificação do Barber-Now.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tipo de Teste de E-mail
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTestType('registration')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition cursor-pointer ${
                    testType === 'registration'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">1. Confirmação de Cadastro</div>
                  <div className={`text-[10px] mt-0.5 ${testType === 'registration' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Boas-vindas & Acesso
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTestType('booking')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition cursor-pointer ${
                    testType === 'booking'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">2. Confirmação de Agendamento</div>
                  <div className={`text-[10px] mt-0.5 ${testType === 'booking' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Corte em Domicílio
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Disparando E-mail via site3facil@gmail.com...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Disparar Teste de {testType === 'registration' ? 'Confirmação de Cadastro' : 'Confirmação de Agendamento'}
                </>
              )}
            </button>
          </form>

          {/* Resultado do Teste */}
          {result && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in duration-150 ${
                result.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {result.success ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    Teste de E-mail Processado com Sucesso!
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    Falha no Disparo
                  </>
                )}
              </div>
              <p className="text-xs">
                {result.message || result.error}
              </p>
              {result.details && (
                <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200/60 font-mono text-[11px] text-slate-700 space-y-1">
                  <div>• Remetente: <strong>{result.details.sender || 'site3facil@gmail.com'}</strong></div>
                  <div>• Destinatário: <strong>{result.details.recipient || recipient}</strong></div>
                  <div>• Produção: <strong>3facil.com</strong></div>
                  {result.details.note && (
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      ℹ️ {result.details.note}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Barber-Now Belém • 3facil.com</span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

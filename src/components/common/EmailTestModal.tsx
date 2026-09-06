import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2, Send, ExternalLink, ShieldCheck, Key, RefreshCw, X, HelpCircle } from 'lucide-react';
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
  const [appPasswordInput, setAppPasswordInput] = useState('');
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  
  const [serverStatus, setServerStatus] = useState<{
    sender: string;
    smtpConfigured: boolean;
    note: string;
  } | null>(null);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [savePassSuccess, setSavePassSuccess] = useState<string | null>(null);

  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    details?: any;
    error?: string;
  } | null>(null);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const status = await api.getEmailStatus();
      setServerStatus(status);
    } catch (e) {
      console.warn('Erro ao obter status do e-mail:', e);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setResult(null);
      setSavePassSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePassword = async () => {
    if (!appPasswordInput.trim() || appPasswordInput.trim().length < 8) {
      alert('Por favor, informe a Senha de Aplicativo de 16 caracteres gerada no Google.');
      return;
    }

    setSavingPass(true);
    setSavePassSuccess(null);
    try {
      const res = await api.saveEmailPassword(appPasswordInput.trim());
      if (res.success) {
        setSavePassSuccess('Senha configurada com sucesso!');
        await fetchStatus();
      } else {
        alert(res.error || 'Erro ao salvar senha.');
      }
    } catch (e: any) {
      alert(e?.message || 'Falha ao salvar senha.');
    } finally {
      setSavingPass(false);
    }
  };

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
        customPassword: appPasswordInput.trim() || undefined,
      });
      setResult(res);
      if (res.success) {
        await fetchStatus();
      }
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
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Central de Envio de E-mails</h3>
              <p className="text-xs text-slate-400">Gmail: site3facil@gmail.com • 3facil.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Bar */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5 text-slate-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Remetente Oficial:
              </span>
              <span className="font-mono bg-blue-50 text-blue-800 border border-blue-200/60 px-2 py-0.5 rounded font-bold">
                site3facil@gmail.com
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Status no Servidor:</span>
                {serverStatus?.smtpConfigured ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle className="w-3 h-3" />
                    Ativo para Envio Real
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                    <AlertCircle className="w-3 h-3" />
                    Senha de App Pendente
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={fetchStatus}
                disabled={loadingStatus}
                className="text-slate-500 hover:text-slate-800 p-1 rounded transition cursor-pointer"
                title="Atualizar status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Se a senha ainda não estiver configurada ou o usuário quiser configurar */}
          {(!serverStatus?.smtpConfigured || showPasswordHelp) && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">
                    {serverStatus?.smtpConfigured ? 'Atualizar Senha de Aplicativo' : 'Por que o e-mail não saiu ainda?'}
                  </h4>
                  <p className="text-amber-900 mt-1 leading-relaxed">
                    O Google exige uma <strong>Senha de Aplicativo (código de 16 letras)</strong> para permitir que sistemas externos enviem e-mails via Gmail (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">site3facil@gmail.com</code>).
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-3 rounded-lg border border-amber-200/80 space-y-2 text-[11px] text-slate-700">
                <p className="font-semibold text-slate-900">Como gerar em 1 minuto na sua conta Google:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Acesse a conta Google do e-mail <strong>site3facil@gmail.com</strong>.</li>
                  <li>Abra o link oficial de Senhas de App: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold inline-flex items-center gap-0.5">myaccount.google.com/apppasswords <ExternalLink className="w-2.5 h-2.5" /></a></li>
                  <li>Dê o nome <strong>BarberNow</strong> e clique em <strong>Criar</strong>.</li>
                  <li>Copie o código gerado de 16 letras (ex: <code className="font-mono bg-slate-100 px-1">abcd efgh ijkl mnop</code>) e cole abaixo:</li>
                </ol>

                <div className="flex gap-2 pt-2">
                  <input
                    type="password"
                    placeholder="Cole a Senha de App de 16 caracteres aqui"
                    value={appPasswordInput}
                    onChange={(e) => setAppPasswordInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSavePassword}
                    disabled={savingPass || !appPasswordInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {savingPass ? 'Salvando...' : 'Salvar Senha'}
                  </button>
                </div>
                {savePassSuccess && (
                  <p className="text-emerald-700 font-semibold text-[11px]">✓ {savePassSuccess}</p>
                )}
              </div>
            </div>
          )}

          {/* Toggle para reconfigurar senha se já configurado */}
          {serverStatus?.smtpConfigured && !showPasswordHelp && (
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Senha de Aplicativo ativa no servidor
              </span>
              <button
                type="button"
                onClick={() => setShowPasswordHelp(true)}
                className="text-blue-600 hover:text-blue-800 underline text-[11px] cursor-pointer"
              >
                Alterar senha de app
              </button>
            </div>
          )}

          {/* Formulário de Disparo de Teste */}
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
                Informe sua caixa de entrada pessoal ou qualquer e-mail para checar a chegada da mensagem.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tipo de E-mail para Testar
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
                    Boas-vindas & Credenciais
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
                  <div className="font-bold">2. Confirmação de Corte</div>
                  <div className={`text-[10px] mt-0.5 ${testType === 'booking' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Agendamento a Domicílio
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
                  Conectando ao Gmail (smtp.gmail.com)...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Disparar E-mail Real Agora
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
                    E-mail Entregue com Sucesso pelo Gmail!
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    Não foi possível enviar o e-mail
                  </>
                )}
              </div>
              
              <p className="text-xs leading-relaxed font-medium">
                {result.message || result.error}
              </p>

              {result.success && (
                <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200/60 font-mono text-[11px] text-slate-700 space-y-1">
                  <div>• Remetente: <strong>site3facil@gmail.com</strong></div>
                  <div>• Entregue para: <strong>{result.target || recipient}</strong></div>
                  <div>• Produzido por: <strong>3facil.com</strong></div>
                  {result.details?.messageId && (
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 truncate">
                      ID Google: {result.details.messageId}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1">
            <span>Produzido por</span>
            <a href="https://3facil.com" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-800 underline">
              3facil.com
            </a>
          </div>
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

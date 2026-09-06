import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Scissors,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useBarberNow } from '../../context/BarberNowContext.tsx';
import { UserRole } from '../../types.ts';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    login,
    registerUser,
    neighborhoods,
    barbers,
  } = useBarberNow();

  const [activeTab, setActiveTab] = useState<'login' | 'register_client' | 'register_barber'>('login');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulário Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole | 'any'>('any');

  // Formulário Pré-cadastro Cliente
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNeighborhood, setClientNeighborhood] = useState('Nazaré');

  // Formulário Pré-cadastro Barbeiro
  const [barberName, setBarberName] = useState('');
  const [barberEmail, setBarberEmail] = useState('');
  const [barberPassword, setBarberPassword] = useState('');
  const [barberPhone, setBarberPhone] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(['Nazaré', 'Umarizal', 'Marco']);

  useEffect(() => {
    if (authModalTab) {
      setActiveTab(authModalTab);
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim()) {
      setErrorMsg('Informe seu e-mail cadastrado.');
      return;
    }

    setIsSubmitting(true);
    const roleToPass = loginRole === 'any' ? undefined : loginRole;
    const res = await login(loginEmail, loginPassword, roleToPass);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao realizar login. Verifique seus dados.');
    } else {
      setSuccessMsg('Login realizado com sucesso!');
      setTimeout(() => {
        closeAuthModal();
      }, 500);
    }
  };

  const handleQuickLogin = async (email: string, role: UserRole) => {
    setIsSubmitting(true);
    setErrorMsg('');
    const res = await login(email, '123456', role);
    setIsSubmitting(false);
    if (res.success) {
      closeAuthModal();
    } else {
      setErrorMsg(res.error || 'Erro no login de demonstração.');
    }
  };

  const handleRegisterClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!clientName.trim()) {
      setErrorMsg('Informe seu nome completo.');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setErrorMsg('Informe um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerUser({
      name: clientName,
      email: clientEmail,
      password: clientPassword || '123456',
      role: 'client',
      phone: clientPhone,
      defaultNeighborhood: clientNeighborhood,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Erro no pré-cadastro de cliente.');
    } else {
      setSuccessMsg('Cadastro criado com sucesso! E-mail de confirmação enviado via site3facil@gmail.com');
      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    }
  };

  const handleRegisterBarberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!barberName.trim()) {
      setErrorMsg('Informe seu nome profissional.');
      return;
    }
    if (!barberEmail.trim() || !barberEmail.includes('@')) {
      setErrorMsg('Informe um e-mail válido para acessar seu dashboard.');
      return;
    }
    if (selectedNeighborhoods.length === 0) {
      setErrorMsg('Selecione ao menos 1 bairro de Belém para atendimento.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerUser({
      name: barberName,
      email: barberEmail,
      password: barberPassword || '123456',
      role: 'barber',
      phone: barberPhone,
      neighborhoods: selectedNeighborhoods,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Erro no cadastro de barbeiro.');
    } else {
      setSuccessMsg('Conta de Barbeiro ativada! Confirmação enviada via site3facil@gmail.com');
      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    }
  };

  const toggleNeighborhood = (name: string) => {
    setSelectedNeighborhoods(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-card"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header com Abas */}
        <div className="bg-slate-900 text-white px-5 pt-5 pb-4 shrink-0 relative">
          <button
            id="auth-modal-close-btn"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              B
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
                Acesse o Barber-Now
              </h2>
              <p className="text-xs text-slate-400">
                Belém-PA • Atendimento Profissional em Domicílio
              </p>
            </div>
          </div>

          {/* Abas Superiores */}
          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              id="tab-auth-login"
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 px-1 rounded-lg transition text-center cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Entrar
            </button>
            <button
              id="tab-auth-register-client"
              type="button"
              onClick={() => {
                setActiveTab('register_client');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 px-1 rounded-lg transition text-center cursor-pointer ${
                activeTab === 'register_client'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Pré-cad. Cliente
            </button>
            <button
              id="tab-auth-register-barber"
              type="button"
              onClick={() => {
                setActiveTab('register_barber');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 px-1 rounded-lg transition text-center cursor-pointer ${
                activeTab === 'register_barber'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Pré-cad. Barbeiro
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Conteúdo da Modal com Scroll */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* TAB: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail Cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-email"
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-password"
                      type="password"
                      placeholder="Sua senha ou 123456"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Entrar como
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginRole('any')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                        loginRole === 'any'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Automático
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('client')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                        loginRole === 'client'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Cliente
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('barber')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                        loginRole === 'barber'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Barbeiro
                    </button>
                  </div>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <span>Entrando...</span>
                  ) : (
                    <>
                      <span>Entrar na Conta</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Acesso Rápido de Teste */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Acesso Rápido de Demonstração (1 Clique)
                </p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('lucas@barbernow.com', 'barber')}
                    className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                        L
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 group-hover:text-blue-700">
                          Lucas "Navalha" Silva
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Barbeiro Parceiro (b1) • Belém
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      Ver Dashboard
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('carlos@email.com', 'client')}
                    className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                        C
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 group-hover:text-emerald-700">
                          Carlos Eduardo
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Cliente Cadastrado • Nazaré
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      Entrar
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRÉ-CADASTRO CLIENTE */}
          {activeTab === 'register_client' && (
            <form onSubmit={handleRegisterClientSubmit} className="space-y-3.5">
              <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl text-xs text-blue-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Pré-cadastro simplificado:</strong> Tenha acesso ao histórico dos seus cortes, receba confirmações por e-mail e agende em segundos.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-client-name"
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Silva"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail para Confirmação *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-client-email"
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Todas as notificações e confirmações de corte serão enviadas aqui.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Crie uma Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-client-password"
                      type="password"
                      placeholder="Mínimo 4 dígitos"
                      value={clientPassword}
                      onChange={e => setClientPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone (Opcional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-client-phone"
                      type="tel"
                      placeholder="(91) 98000-0000"
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seu Bairro Padrão em Belém
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="select-client-neighborhood"
                    value={clientNeighborhood}
                    onChange={e => setClientNeighborhood(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                  >
                    {neighborhoods.map(n => (
                      <option key={n.name} value={n.name}>
                        {n.name} ({n.region}) - Belém-PA
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="btn-submit-register-client"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                {isSubmitting ? (
                  <span>Cadastrando...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir Cadastro de Cliente</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB: PRÉ-CADASTRO BARBEIRO */}
          {activeTab === 'register_barber' && (
            <form onSubmit={handleRegisterBarberSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <Scissors className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Pré-cadastro de Barbeiro:</strong> Crie seu acesso imediato para receber solicitações de corte a domicílio e gerenciar agendamentos no seu Dashboard.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Profissional do Barbeiro *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-barber-name"
                    type="text"
                    required
                    placeholder="Ex: Lucas Silva (Navalha)"
                    value={barberName}
                    onChange={e => setBarberName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail de Login do Barbeiro *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-barber-email"
                    type="email"
                    required
                    placeholder="seu.email@barbearia.com"
                    value={barberEmail}
                    onChange={e => setBarberEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Crie uma Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-barber-password"
                      type="password"
                      placeholder="Mínimo 4 dígitos"
                      value={barberPassword}
                      onChange={e => setBarberPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone Interno (Opcional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-barber-phone"
                      type="tel"
                      placeholder="(91) 98000-0000"
                      value={barberPhone}
                      onChange={e => setBarberPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bairros de Belém que você atende ({selectedNeighborhoods.length} selecionados)
                </label>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50 grid grid-cols-2 gap-1.5">
                  {neighborhoods.map(n => {
                    const isSelected = selectedNeighborhoods.includes(n.name);
                    return (
                      <button
                        key={n.name}
                        type="button"
                        onClick={() => toggleNeighborhood(n.name)}
                        className={`text-left text-xs p-1.5 rounded-lg font-medium transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{n.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                id="btn-submit-register-barber"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                {isSubmitting ? (
                  <span>Cadastrando...</span>
                ) : (
                  <>
                    <Scissors className="w-4 h-4 text-amber-400" />
                    <span>Cadastrar e Acessar Meu Dashboard</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Rodapé Seguro */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Notificações oficiais via <strong>site3facil@gmail.com</strong></span>
            </div>
            <div>
              Produzido por <a href="https://3facil.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold underline">3facil.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

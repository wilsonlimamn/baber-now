import React, { useState } from 'react';
import {
  UserCheck,
  Scissors,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Sparkles,
  Camera,
  ArrowRight
} from 'lucide-react';
import { useBarberNow } from '../../context/BarberNowContext.tsx';
import { DEFAULT_SERVICES } from '../../data/initialData.ts';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300&auto=format&fit=crop&q=80',
];

export const BarberRegistrationForm: React.FC = () => {
  const { neighborhoods, registerBarber, setCurrentView } = useBarberNow();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([
    'Pinheiros',
    'Jardins',
    'Vila Madalena'
  ]);
  const [workingStart, setWorkingStart] = useState('08:00');
  const [workingEnd, setWorkingEnd] = useState('20:00');

  const handleToggleNeighborhood = (neighborhoodName: string) => {
    if (selectedNeighborhoods.includes(neighborhoodName)) {
      setSelectedNeighborhoods(selectedNeighborhoods.filter(n => n !== neighborhoodName));
    } else {
      setSelectedNeighborhoods([...selectedNeighborhoods, neighborhoodName]);
    }
  };

  const handleSelectAllNeighborhoods = () => {
    if (selectedNeighborhoods.length === neighborhoods.length) {
      setSelectedNeighborhoods([]);
    } else {
      setSelectedNeighborhoods(neighborhoods.map(n => n.name));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert('Por favor, preencha o nome e o WhatsApp do barbeiro.');
      return;
    }

    if (selectedNeighborhoods.length === 0) {
      alert('Por favor, selecione pelo menos um bairro de atendimento.');
      return;
    }

    registerBarber({
      name: name.trim(),
      avatar,
      phone: phone.trim(),
      experienceYears: Number(experienceYears) || 3,
      bio: bio.trim() || 'Barbeiro profissional com atendimento pontual e equipamentos esterilizados em domicílio.',
      neighborhoods: selectedNeighborhoods,
      services: DEFAULT_SERVICES,
      workingHours: {
        start: workingStart,
        end: workingEnd,
      },
      availableDays: [1, 2, 3, 4, 5, 6],
      status: 'available',
      city: city.trim() || 'São Paulo',
    });

    // Navigate to agenda to immediately see the new barber's schedule
    setCurrentView('barber_agenda');
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Cadastro de Barbeiro Parceiro Barber-Now
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Defina seus dados profissionais, os bairros onde você tem disponibilidade de atender e ative sua agenda de cortes em domicílio.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Foto do Perfil:
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {AVATAR_PRESETS.map((presetUrl, idx) => (
                <img
                  key={idx}
                  src={presetUrl}
                  alt={`Opção ${idx + 1}`}
                  onClick={() => setAvatar(presetUrl)}
                  className={`w-14 h-14 rounded-2xl object-cover cursor-pointer transition border-2 ${
                    avatar === presetUrl
                      ? 'border-blue-600 ring-2 ring-blue-600/30 scale-105'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nome Completo / Apelido Profissional <span className="text-blue-600">*</span>
              </label>
              <input
                id="input-barber-name"
                type="text"
                required
                placeholder="Ex: Carlos 'Mão de Ouro' Silva"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                WhatsApp de Contato <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-barber-phone"
                  type="tel"
                  required
                  placeholder="Ex: (11) 99876-5432"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Anos de Experiência
              </label>
              <input
                type="number"
                min="1"
                max="40"
                value={experienceYears}
                onChange={e => setExperienceYears(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cidade Principal
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Biografia / Especialidades
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Especialista em degradê navalhado, barboterapia relaxante com toalha quente e atendimento infantil paciente."
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Working Hours */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Horário de Disponibilidade para Atendimentos:</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span className="text-[11px] text-slate-500 block mb-1">Início:</span>
                <input
                  type="time"
                  value={workingStart}
                  onChange={e => setWorkingStart(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <span className="text-slate-400 pt-5">até</span>
              <div className="flex-1">
                <span className="text-[11px] text-slate-500 block mb-1">Término:</span>
                <input
                  type="time"
                  value={workingEnd}
                  onChange={e => setWorkingEnd(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Coverage Neighborhoods (CRUCIAL USER REQUIREMENT) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Bairros onde você atenderá em domicílio:</span>
                <span className="text-blue-600">*</span>
              </label>

              <button
                type="button"
                onClick={handleSelectAllNeighborhoods}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer"
              >
                {selectedNeighborhoods.length === neighborhoods.length ? 'Desmarcar Todos' : 'Marcar Todos'}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Selecione as regiões onde você tem fácil deslocamento. Você pode alterar essa lista a qualquer momento na sua agenda.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 border border-slate-200 rounded-xl p-3 bg-slate-50">
              {neighborhoods.map(nb => {
                const isSelected = selectedNeighborhoods.includes(nb.name);
                return (
                  <label
                    key={nb.name}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition select-none ${
                      isSelected
                        ? 'bg-blue-50 text-slate-900 font-semibold border border-blue-300'
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleNeighborhood(nb.name)}
                      className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="truncate">{nb.name}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {selectedNeighborhoods.length} bairro(s) selecionado(s).
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentView('client')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-submit-barber-registration"
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition shadow-xs cursor-pointer"
            >
              <span>Cadastrar e Abrir Minha Agenda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

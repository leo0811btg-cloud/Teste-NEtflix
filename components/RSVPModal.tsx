import React, { useState, FormEvent } from 'react';
import type { Guest } from '../types';

type Step = 'SEARCH_NAME' | 'SEARCH_LASTNAME' | 'CONFIRM' | 'SUBMITTED' | 'ALREADY_RESPONDED' | 'ERROR';

interface RSVPModalProps {
  onClose: () => void;
  guestList: Guest[];
  updateGuestAttendance: (guestId: number, attendance: 'yes' | 'no') => Promise<void>;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ onClose, guestList, updateGuestAttendance }) => {
  const [step, setStep] = useState<Step>('SEARCH_NAME');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [foundGuests, setFoundGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearchByName = (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
        setError('Por favor, digite seu primeiro nome.');
        return;
    }
    setError('');

    const normalizedFirstName = firstName.trim().toLowerCase();
    const matches = guestList.filter(guest => 
        guest.name.toLowerCase().split(' ')[0] === normalizedFirstName
    );

    if (matches.length === 0) {
        setError('Nome não encontrado na lista. Verifique a digitação ou entre em contato com os noivos.');
    } else if (matches.length === 1) {
        const guest = matches[0];
        if (guest.attendance !== 'pending') {
            setSelectedGuest(guest);
            setStep('ALREADY_RESPONDED');
        } else {
            setSelectedGuest(guest);
            setStep('CONFIRM');
        }
    } else {
        setFoundGuests(matches);
        setStep('SEARCH_LASTNAME');
    }
  };
  
  const handleSearchByLastName = (e: FormEvent) => {
      e.preventDefault();
      if (!lastName.trim()) {
          setError('Por favor, digite seu sobrenome.');
          return;
      }
      setError('');

      const normalizedLastName = lastName.trim().toLowerCase();
      const finalMatch = foundGuests.find(guest => 
        (guest.name.toLowerCase().split(' ')[1] || '') === normalizedLastName
      );

      if (finalMatch) {
          if (finalMatch.attendance !== 'pending') {
              setSelectedGuest(finalMatch);
              setStep('ALREADY_RESPONDED');
          } else {
              setSelectedGuest(finalMatch);
              setStep('CONFIRM');
          }
      } else {
          setError('Combinação de nome e sobrenome não encontrada. Tente novamente.');
      }
  };

  const handleConfirm = async (attendance: 'yes' | 'no') => {
      if (!selectedGuest) return;
      setIsSubmitting(true);
      setError('');
      try {
          await updateGuestAttendance(selectedGuest.id, attendance);
          setStep('SUBMITTED');
      } catch (err) {
          setError('Ocorreu um erro ao enviar sua resposta. Tente novamente.');
      } finally {
          setIsSubmitting(false);
      }
  };

  const renderContent = () => {
      switch (step) {
          case 'SEARCH_NAME':
              return (
                  <>
                      <h3 className="font-bebas text-3xl text-center text-white mb-6">Confirme sua Presença</h3>
                      <form onSubmit={handleSearchByName} className="space-y-4">
                          <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-zinc-400 mb-2">Digite seu primeiro nome</label>
                              <input
                                  type="text"
                                  id="firstName"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className="w-full bg-zinc-800 border-zinc-700 text-white rounded-md p-3 focus:ring-red-500 focus:border-red-500"
                                  required
                                  autoFocus
                              />
                          </div>
                          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition-colors duration-300">
                              Buscar
                          </button>
                      </form>
                  </>
              );
          case 'SEARCH_LASTNAME':
              return (
                  <>
                      <h3 className="font-bebas text-3xl text-center text-white mb-2">Encontramos alguns nomes...</h3>
                      <p className="text-zinc-400 text-center mb-6">Para confirmar quem é você, digite seu primeiro sobrenome.</p>
                      <form onSubmit={handleSearchByLastName} className="space-y-4">
                          <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-zinc-400 mb-2">Seu sobrenome</label>
                              <input
                                  type="text"
                                  id="lastName"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  className="w-full bg-zinc-800 border-zinc-700 text-white rounded-md p-3 focus:ring-red-500 focus:border-red-500"
                                  required
                                  autoFocus
                              />
                          </div>
                          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition-colors duration-300">
                              Confirmar Identidade
                          </button>
                      </form>
                  </>
              );
          case 'CONFIRM':
              return (
                  <div className="text-center">
                      <h3 className="font-bebas text-3xl text-white mb-2">Olá, {selectedGuest?.name}!</h3>
                      <p className="text-zinc-300 mb-6">Você irá comparecer ao nosso grande dia?</p>
                      <div className="flex items-center space-x-4">
                          <button onClick={() => handleConfirm('yes')} disabled={isSubmitting} className="flex-1 py-3 rounded-md font-bold transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-zinc-600">
                              Sim, com certeza!
                          </button>
                          <button onClick={() => handleConfirm('no')} disabled={isSubmitting} className="flex-1 py-3 rounded-md font-bold transition-colors bg-red-600 text-white hover:bg-red-700 disabled:bg-zinc-600">
                              Não poderei ir
                          </button>
                      </div>
                      {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                  </div>
              );
          case 'SUBMITTED':
              return (
                  <div className="text-center">
                      <h3 className="font-bebas text-3xl text-red-600 mb-4">Obrigado!</h3>
                      <p className="text-zinc-300">Sua resposta foi enviada com sucesso.</p>
                      <p className="text-zinc-300">Mal podemos esperar para celebrar com você!</p>
                      <button onClick={onClose} className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition-colors duration-300">
                          Fechar
                      </button>
                  </div>
              );
          case 'ALREADY_RESPONDED':
              return (
                  <div className="text-center">
                      <h3 className="font-bebas text-3xl text-white mb-4">Olá, {selectedGuest?.name}!</h3>
                      <p className="text-zinc-300">Já recebemos a sua resposta, muito obrigado!</p>
                      <p className="text-zinc-400 text-sm mt-2">Caso precise alterar, por favor, entre em contato com os noivos.</p>
                      <button onClick={onClose} className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition-colors duration-300">
                          Fechar
                      </button>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-md mx-auto p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

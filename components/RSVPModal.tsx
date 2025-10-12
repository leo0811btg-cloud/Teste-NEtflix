import React, { useState } from 'react';
import type { RsvpResponse } from '../types';

interface RSVPModalProps {
  onClose: () => void;
  addRsvpResponse: (response: Omit<RsvpResponse, 'id'>) => Promise<void>;
  guestList: string[];
  rsvpResponses: RsvpResponse[];
}

// Helper function to normalize strings for comparison (case-insensitive, accent-insensitive)
const normalizeString = (str: string) => 
  str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");


export const RSVPModal: React.FC<RSVPModalProps> = ({ onClose, addRsvpResponse, guestList, rsvpResponses }) => {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !attendance) return;
    
    setIsSubmitting(true);
    setError('');
    
    const normalizedName = normalizeString(name);

    // 1. Check if guest list is active and if name is on it
    if (guestList && guestList.length > 0) {
      const isGuestOnList = guestList.some(guest => normalizeString(guest) === normalizedName);
      if (!isGuestOnList) {
        setError('Seu nome não foi encontrado na lista. Por favor, verifique a digitação ou entre em contato com os noivos.');
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Check if this guest has already responded
    const hasAlreadyResponded = rsvpResponses.some(response => normalizeString(response.name) === normalizedName);
    if (hasAlreadyResponded) {
      setError('Já recebemos uma resposta para este nome. Obrigado!');
      setIsSubmitting(false);
      return;
    }

    try {
      await addRsvpResponse({ name: name.trim(), attendance });
      setSubmitted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido. Por favor, tente novamente.';
      // Check for specific error messages from server to provide better feedback
      if (errorMessage.includes('convidado já respondeu')) {
        setError('Já recebemos uma resposta para este nome. Obrigado!');
      } else if (errorMessage.includes('não está na lista')) {
        setError('Seu nome não foi encontrado na lista. Por favor, verifique a digitação ou entre em contato com os noivos.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
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

        {submitted ? (
          <div className="text-center">
            <h3 className="font-bebas text-3xl text-red-600 mb-4">Obrigado!</h3>
            <p className="text-zinc-300">Sua resposta foi enviada com sucesso.</p>
            <p className="text-zinc-300">Mal podemos esperar para celebrar com você!</p>
            <button onClick={onClose} className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition-colors duration-300">
                Fechar
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-bebas text-3xl text-center text-white mb-6">Confirme sua Presença</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">Seu nome completo (como no convite)</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 text-white rounded-md p-3 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-2">Você irá comparecer?</p>
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={() => setAttendance('yes')} className={`flex-1 py-3 rounded-md font-bold transition-colors ${attendance === 'yes' ? 'bg-green-600 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                        Sim, com certeza!
                    </button>
                    <button type="button" onClick={() => setAttendance('no')} className={`flex-1 py-3 rounded-md font-bold transition-colors ${attendance === 'no' ? 'bg-red-600 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                        Não poderei ir
                    </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition-colors duration-300 disabled:bg-zinc-600 flex items-center justify-center" disabled={!name || !attendance || isSubmitting}>
                {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : 'Enviar Resposta'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import type { RsvpResponse } from '../types';

interface RSVPModalProps {
  onClose: () => void;
  onConfirm: (response: RsvpResponse) => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && attendance) {
      const newResponse: RsvpResponse = {
        id: Date.now(),
        name,
        attendance,
      };
      onConfirm(newResponse);
      setSubmitted(true);
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
                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">Seu nome completo</label>
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
              <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition-colors duration-300 disabled:bg-zinc-600" disabled={!name || !attendance}>
                Enviar Resposta
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

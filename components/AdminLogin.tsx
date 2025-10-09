
import React, { useState } from 'react';

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Amor') {
      onLoginSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-sm mx-auto p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors" aria-label="Fechar modal de login">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="font-bebas text-3xl text-center text-white mb-6">Acesso ADM</h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-white rounded-md p-3 focus:ring-red-500 focus:border-red-500"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition-colors duration-300">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

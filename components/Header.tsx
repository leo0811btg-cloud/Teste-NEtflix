
import React from 'react';

interface HeaderProps {
    coupleNames: string;
    onRSVPClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ coupleNames, onRSVPClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-16 py-4 flex justify-between items-center bg-gradient-to-b from-black to-transparent transition-colors duration-300">
      <h1 className="text-2xl md:text-4xl text-red-600 font-bebas tracking-wider">
        {coupleNames}
      </h1>
      <button 
        onClick={onRSVPClick}
        className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition-colors duration-300 text-sm md:text-base"
      >
        Confirmar Presença
      </button>
    </header>
  );
};

import React from 'react';
import type { Gift } from '../types';

interface GiftCardProps {
  gift: Gift;
  onGiftClick: () => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({ gift, onGiftClick }) => {
  return (
    <div className="flex-shrink-0 w-60 md:w-64 mr-4 group">
      <div className="relative overflow-hidden rounded-md bg-zinc-800 transition-transform duration-300 transform group-hover:scale-105 shadow-lg">
        <img src={gift.imageUrl} alt={gift.name} className="w-full h-40 object-cover" />
        <div className="p-4 text-white">
          <h4 className="font-bold text-base truncate">{gift.name}</h4>
          <p className="text-sm text-zinc-400 mt-1">
            {gift.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <button
            onClick={onGiftClick}
            className="w-full mt-4 bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300 text-sm"
          >
            Presentear
          </button>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import type { StoryItem } from '../types';

interface StoryCardProps {
  item: StoryItem;
}

export const StoryCard: React.FC<StoryCardProps> = ({ item }) => {
  return (
    <div className="flex-shrink-0 w-64 md:w-80 h-auto mr-4 group cursor-pointer">
      <div className="relative overflow-hidden rounded-md transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-red-800/20">
        <img src={item.imageUrl} alt={item.title} className="w-full h-36 md:h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="p-4 bg-zinc-800">
            <h4 className="font-bold text-lg mb-2">{item.title}</h4>
            <p className="text-sm text-zinc-400 h-20 overflow-hidden">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

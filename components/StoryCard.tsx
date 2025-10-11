import React from 'react';
import type { StoryItem } from '../types';

interface StoryCardProps {
  item: StoryItem;
}

export const StoryCard: React.FC<StoryCardProps> = ({ item }) => {
  return (
    <div className="flex-shrink-0 w-64 md:w-80 h-auto mr-4 group cursor-pointer">
      <div className="overflow-hidden rounded-md transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-red-800/20">
        
        {/* Container for the image and its gradient overlay. This is the key change. */}
        <div className="relative">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-72 md:h-88 object-cover" 
            style={{ objectPosition: item.imagePosition || 'center' }}
          />
          {/* This gradient is now correctly contained and only covers the image. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>
        
        {/* The text content has a solid background and is no longer obscured by the overlay. */}
        <div className="p-4 bg-zinc-800">
            <h4 className="font-bold text-lg mb-2 text-white">{item.title}</h4>
            {/* The text color is brighter and height restrictions are removed for readability. */}
            <p className="text-sm text-zinc-200">{item.description}</p>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import type { Person } from '../types';

interface PersonCardProps {
  person: Person;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 mr-4 group">
      <div className="relative overflow-hidden rounded-md aspect-[3/4] transition-transform duration-300 transform group-hover:scale-105">
        <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 p-3 text-white">
          <h4 className="font-bold text-lg">{person.name}</h4>
          <p className="text-sm text-zinc-300">{person.role}</p>
        </div>
      </div>
    </div>
  );
};

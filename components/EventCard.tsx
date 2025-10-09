import React from 'react';
import type { EventDetails } from '../types';

const CeremonyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PartyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14h6"/>
    </svg>
);

const icons = {
    ceremony: <CeremonyIcon />,
    party: <PartyIcon />,
};

interface EventCardProps {
    event: EventDetails;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div className="flex-shrink-0 w-72 md:w-80 mr-4 bg-zinc-800 rounded-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            {icons[event.icon] || null}
            <h4 className="font-bebas text-2xl tracking-wider text-white">{event.title}</h4>
            <p className="font-bold mt-2 text-zinc-300">{event.date} às {event.time}</p>
            <p className="mt-2 text-zinc-400">{event.location}</p>
            <p className="text-sm text-zinc-500">{event.address}</p>
            <div className="mt-4 pt-4 border-t border-zinc-700 w-full">
                <p className="text-sm text-zinc-400"><strong>Traje:</strong> {event.dressCode}</p>
            </div>
        </div>
    );
}
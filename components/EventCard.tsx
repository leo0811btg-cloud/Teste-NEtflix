
import React from 'react';
import type { EventDetails } from '../types';

interface EventCardProps {
    event: EventDetails;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div className="flex-shrink-0 w-72 md:w-80 mr-4 bg-zinc-800 rounded-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            {event.icon}
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


import React from 'react';
import { Countdown } from './Countdown';
import { WEDDING_DATE } from '../constants';
import type { HeroData } from '../types';

interface HeroProps {
    heroData: HeroData;
}

export const Hero: React.FC<HeroProps> = ({ heroData }) => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-black">
        <img 
          src={heroData.imageUrl} 
          alt="Maria e João" 
          className="w-full h-full object-cover opacity-50" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h2 className="font-bebas text-5xl md:text-8xl lg:text-9xl tracking-widest">
          {heroData.coupleNames}
        </h2>
        <p className="mt-4 text-lg md:text-2xl">{heroData.subtitle}</p>
        <div className="my-8">
            <Countdown targetDate={WEDDING_DATE} />
        </div>
      </div>
    </div>
  );
};

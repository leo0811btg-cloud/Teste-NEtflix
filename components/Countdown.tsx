
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft | {} => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft | {} = {};

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  // FIX: Changed JSX.Element to React.ReactElement to resolve namespace error.
  const timerComponents: React.ReactElement[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof TimeLeft]) {
      return;
    }
    timerComponents.push(
      <div key={interval} className="text-center">
        <div className="font-bebas text-4xl md:text-6xl">
          {String(timeLeft[interval as keyof TimeLeft]).padStart(2, '0')}
        </div>
        <div className="text-sm uppercase tracking-widest">{interval}</div>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-4 gap-4 md:gap-8">
      {timerComponents.length ? timerComponents : null}
    </div>
  );
};

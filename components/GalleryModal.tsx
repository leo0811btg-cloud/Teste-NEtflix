
import React, { useState } from 'react';
import type { GalleryImage } from '../types';

interface GalleryModalProps {
  images: GalleryImage[];
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full h-full max-w-4xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-red-500 transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-16 text-white p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="w-full h-full flex items-center justify-center">
            <img src={images[currentIndex].src} alt={images[currentIndex].alt} className="max-w-full max-h-full object-contain rounded-lg" />
        </div>

        <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-16 text-white p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

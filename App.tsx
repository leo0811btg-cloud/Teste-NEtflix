import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryRow } from './components/CategoryRow';
import { PersonCard } from './components/PersonCard';
import { StoryCard } from './components/StoryCard';
import { EventCard } from './components/EventCard';
import { GiftCard } from './components/GiftCard';
import { RSVPModal } from './components/RSVPModal';
import { GalleryModal } from './components/GalleryModal';
import { GiftModal } from './components/GiftModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { useSiteData } from './hooks/useSiteData';
import type { Person, StoryItem, EventDetails, GalleryImage, Gift } from './types';

const App: React.FC = () => {
  const siteData = useSiteData();
  const { 
    heroData, ourStory, weddingParty, eventDetails, 
    galleryImages, giftList, isLoading, error
  } = siteData;

  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
        <div className="bg-zinc-900 text-white min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-5xl text-red-600 font-bebas tracking-wider mb-4 animate-pulse">OurFlix</h1>
            <p>Carregando nossa história...</p>
        </div>
    );
  }

  if (error || !heroData) {
     return (
        <div className="bg-zinc-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl text-red-600 font-bebas tracking-wider mb-4">Oops! Falha na Conexão</h1>
            <p className="mb-4">Houve um problema ao carregar os dados do site.</p>
            <p className="text-zinc-400 text-sm mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700">
                Tentar Novamente
            </button>
        </div>
    );
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <Header coupleNames={heroData.coupleNames} onRSVPClick={() => setIsRSVPOpen(true)} />
      <main>
        <Hero heroData={heroData} />
        <div className="py-8 md:py-16 space-y-8 md:space-y-12 overflow-hidden">
          <CategoryRow title="O Enredo">
            {ourStory.map((item: StoryItem) => (
              <StoryCard key={item.id} item={item} />
            ))}
          </CategoryRow>
          <CategoryRow title="Elenco Principal">
            {weddingParty.filter(p => p.role.includes('Noiv')).map((person: Person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </CategoryRow>
           <CategoryRow title="A Grande Estreia">
            {eventDetails.map((event: EventDetails) => (
              <EventCard key={event.id} event={event} />
            ))}
          </CategoryRow>
          <CategoryRow title="Elenco de Apoio">
            {weddingParty.filter(p => !p.role.includes('Noiv')).map((person: Person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </CategoryRow>
          <CategoryRow title="Lista de Presentes">
            {giftList.map((gift: Gift) => (
              <GiftCard key={gift.id} gift={gift} onGiftClick={() => setSelectedGift(gift)} />
            ))}
          </CategoryRow>
          <CategoryRow title="Galeria de Fotos">
            {galleryImages.map((image: GalleryImage) => (
               <div key={image.id} className="flex-shrink-0 w-64 md:w-80 h-36 md:h-44 mr-4" onClick={() => setIsGalleryOpen(true)}>
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover rounded-md cursor-pointer transform hover:scale-105 transition-transform duration-300" />
               </div>
            ))}
          </CategoryRow>
        </div>
      </main>
      <footer className="text-center py-8 text-zinc-500 border-t border-zinc-800 relative">
        <p>Feito com ❤️ para Maria & João</p>
        <p>&copy; 2024. Todos os direitos reservados.</p>
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="absolute bottom-4 right-4 bg-zinc-700 text-zinc-400 text-xs font-bold py-1 px-3 rounded hover:bg-zinc-600 hover:text-white transition-colors"
        >
          ADM
        </button>
      </footer>

      {isRSVPOpen && (
        <RSVPModal 
          onClose={() => setIsRSVPOpen(false)} 
          onConfirmSuccess={() => {
              siteData.fetchData(); // Busca os dados novamente para atualizar a lista de presença no painel ADM
          }}
        />
      )}
      {isGalleryOpen && <GalleryModal images={galleryImages} onClose={() => setIsGalleryOpen(false)} />}
      {selectedGift && <GiftModal gift={selectedGift} pixConfig={siteData.pixConfig} onClose={() => setSelectedGift(null)} />}
      {isLoginOpen && <AdminLogin onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />}
      {isAuthenticated && <AdminPanel siteData={siteData} onClose={() => setIsAuthenticated(false)} />}
    </div>
  );
};

export default App;
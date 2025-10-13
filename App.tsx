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
    galleryImages, giftList, pixConfig, guestList,
    isLoading, error, updateGuestAttendance, isConfigError
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
        <svg className="animate-spin h-10 w-10 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="font-bebas text-2xl tracking-wider">Carregando os detalhes do casamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
        {isConfigError ? (
            <>
                <h2 className="font-bebas text-3xl text-red-500 mb-2">Quase lá! Faltam algumas configurações.</h2>
                <p className="text-zinc-300 max-w-2xl mb-6">
                    Para o site funcionar, precisamos conectar o banco de dados (para textos) e o armazenamento de imagens. É super rápido!
                </p>
                <div className="bg-zinc-800 p-6 rounded-lg text-left max-w-3xl w-full border border-zinc-700">
                    <h3 className="font-bold text-lg mb-4 text-white">Como resolver:</h3>
                    <ol className="list-decimal list-inside space-y-4 text-zinc-400">
                        <li>
                            No painel do seu projeto na <strong>Vercel</strong>, vá para a aba <strong>"Storage"</strong>.
                        </li>
                        <li>
                            <strong>Para os textos:</strong> Na seção "Marketplace", clique em <strong>"Upstash"</strong> e depois selecione <strong>"Upstash for Redis"</strong>. Conecte o plano gratuito (Hobby).
                        </li>
                        <li>
                            <strong>Para as imagens:</strong> De volta à aba "Storage", encontre a opção <strong>"Blob (Fast object storage)"</strong> e conecte-a.
                        </li>
                        <li>
                            Agora, vá para <strong>"Settings"</strong> &gt; <strong>"Environment Variables"</strong>.
                        </li>
                        <li>
                            Verifique se as variáveis do KV (<code>KV_URL</code>, etc) e do Blob (<code>BLOB_READ_WRITE_TOKEN</code>) foram criadas, e se a variável <code>API_KEY</code> (com sua chave do Gemini) existe. Se não, crie-a.
                        </li>
                        <li>
                            <strong>Passo crucial:</strong> Para aplicar tudo, vá na aba <strong>"Deployments"</strong>, encontre o último deploy, clique no menu (...) e selecione <strong>"Redeploy"</strong>.
                        </li>
                    </ol>
                </div>
                 <p className="text-xs text-zinc-600 mt-6">Detalhes técnicos do erro: {error}</p>
            </>
        ) : (
            <>
                <h2 className="font-bebas text-3xl text-red-500 mb-2">Oops! Algo deu errado.</h2>
                <p className="text-zinc-400">Não foi possível carregar os dados do site. Por favor, tente recarregar a página.</p>
                <p className="text-xs text-zinc-600 mt-4">Detalhes do erro: {error}</p>
            </>
        )}
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
        <p>Feito com ❤️ para Yasmin & Leomar</p>
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
          guestList={guestList}
          updateGuestAttendance={updateGuestAttendance}
        />
      )}
      {isGalleryOpen && <GalleryModal images={galleryImages} onClose={() => setIsGalleryOpen(false)} />}
      {selectedGift && <GiftModal gift={selectedGift} pixConfig={pixConfig} onClose={() => setSelectedGift(null)} />}
      {isLoginOpen && <AdminLogin onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />}
      {isAuthenticated && <AdminPanel siteData={siteData} onClose={() => setIsAuthenticated(false)} />}
    </div>
  );
};

export default App;
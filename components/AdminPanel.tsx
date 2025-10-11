import React, { useState, useMemo } from 'react';
import type { useSiteData } from '../hooks/useSiteData';
import type { Gift, PixConfig, HeroData, StoryItem, Person, EventDetails, GalleryImage } from '../types';

type SiteData = ReturnType<typeof useSiteData>;

interface AdminPanelProps {
  siteData: SiteData;
  onClose: () => void;
}

// Helper para upload de imagens para a API do Vercel Blob
const uploadImage = async (file: File): Promise<string> => {
    const response = await fetch(`/api/upload-image?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao enviar imagem.');
    }
    const newBlob = await response.json();
    return newBlob.url;
};


type AdminTab = 'content' | 'gifts' | 'rsvp';

export const AdminPanel: React.FC<AdminPanelProps> = ({ siteData, onClose }) => {
    const { 
        heroData, setHeroData, 
        ourStory, setOurStory,
        weddingParty, setWeddingParty,
        eventDetails, setEventDetails,
        galleryImages, setGalleryImages,
        giftList, setGiftList,
        pixConfig, setPixConfig,
        rsvpResponses,
    } = siteData;
    const [activeTab, setActiveTab] = useState<AdminTab>('content');
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);


    const handleImageChange = async (
        file: File | null,
        id: string,
        updateFunction: (url: string) => void
    ) => {
        if (!file) return;
        setUploadingId(id);
        setUploadError(null);
        try {
            const newUrl = await uploadImage(file);
            updateFunction(newUrl);
        } catch (error) {
            console.error(error);
            setUploadError(error instanceof Error ? error.message : 'Erro desconhecido');
        } finally {
            setUploadingId(null);
        }
    };


    const handleHeroChange = (field: keyof HeroData, value: string) => {
        setHeroData({ ...heroData, [field]: value });
    };
    
    const handleHeroImageChange = (file: File | null) => {
        handleImageChange(file, 'hero', (url) => handleHeroChange('imageUrl', url));
    };

    const handleStoryChange = (index: number, field: keyof StoryItem, value: string) => {
        const newStory = [...ourStory];
        newStory[index] = { ...newStory[index], [field]: value };
        setOurStory(newStory);
    };
    
    const handleStoryImageChange = (index: number, file: File | null) => {
        handleImageChange(file, `story-${index}`, (url) => handleStoryChange(index, 'imageUrl', url));
    };
    
    const handlePartyChange = (index: number, field: keyof Person, value: string) => {
        const newParty = [...weddingParty];
        newParty[index] = { ...newParty[index], [field]: value };
        setWeddingParty(newParty);
    };

    const handlePartyImageChange = (index: number, file: File | null) => {
        handleImageChange(file, `party-${index}`, (url) => handlePartyChange(index, 'imageUrl', url));
    };
    
    const handleEventChange = (index: number, field: keyof EventDetails, value: string) => {
        const newDetails = [...eventDetails];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setEventDetails(newDetails);
    };

    const handleGalleryImageChange = (index: number, field: keyof GalleryImage, value: string) => {
        const newImages = [...galleryImages];
        newImages[index] = { ...newImages[index], [field]: value };
        setGalleryImages(newImages);
    };

    const handleAddGalleryImage = async (file: File | null) => {
        handleImageChange(file, 'new-gallery-image', (url) => {
            const newImage: GalleryImage = {
                id: Date.now(),
                src: url,
                alt: 'Nova foto do casal'
            };
            setGalleryImages([...galleryImages, newImage]);
        });
    };

    const handleRemoveGalleryImage = (id: number) => {
        setGalleryImages(galleryImages.filter(image => image.id !== id));
    };

    const handleGiftChange = (index: number, field: keyof Omit<Gift, 'id'>, value: string | number) => {
        const newGiftList = [...giftList];
        const finalValue = field === 'price' ? Number(value) : value;
        newGiftList[index] = { ...newGiftList[index], [field]: finalValue };
        setGiftList(newGiftList);
    };

    const handleGiftImageChange = (index: number, file: File | null) => {
         const newGiftList = [...giftList];
         handleImageChange(file, `gift-${index}`, (url) => {
            newGiftList[index] = { ...newGiftList[index], imageUrl: url };
            setGiftList(newGiftList);
         });
    };

    const handleAddGift = () => {
        const newGift: Gift = {
            id: Date.now(),
            name: 'Novo Presente',
            price: 0,
            imageUrl: 'https://placehold.co/400x300/27272a/e5e5e5?text=Imagem',
            imagePosition: 'center',
        };
        setGiftList([...giftList, newGift]);
    };

    const handleRemoveGift = (id: number) => {
        setGiftList(giftList.filter(gift => gift.id !== id));
    };

    const handlePixConfigChange = (field: keyof PixConfig, value: string) => {
        let processedValue = value;
        if (field === 'recipientName' || field === 'city') {
            processedValue = processedValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        if (field === 'city') {
            processedValue = processedValue.toUpperCase();
        }
        setPixConfig({ ...pixConfig, [field]: processedValue });
    };
    
    const rsvpCounts = useMemo(() => {
        return rsvpResponses.reduce((acc, response) => {
            if (response.attendance === 'yes') {
                acc.yes++;
            } else {
                acc.no++;
            }
            return acc;
        }, { yes: 0, no: 0 });
    }, [rsvpResponses]);

  return (
    <div className="fixed inset-0 bg-zinc-900 bg-opacity-95 z-[100] p-4 md:p-8 overflow-y-auto text-white" aria-modal="true" role="dialog">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h2 className="font-bebas text-4xl text-red-500">Painel de Edição</h2>
            <button onClick={onClose} className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition-colors">
                Fechar
            </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-zinc-700 flex items-center gap-4">
            <button onClick={() => setActiveTab('content')} className={`font-bebas text-xl py-2 px-4 ${activeTab === 'content' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-400'}`}>Conteúdo do Site</button>
            <button onClick={() => setActiveTab('gifts')} className={`font-bebas text-xl py-2 px-4 ${activeTab === 'gifts' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-400'}`}>Presentes & PIX</button>
            <button onClick={() => setActiveTab('rsvp')} className={`font-bebas text-xl py-2 px-4 ${activeTab === 'rsvp' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-400'}`}>Confirmações</button>
        </div>

        {uploadError && (
            <div className="bg-red-800/50 text-red-200 p-3 rounded-lg mb-4 text-center">
                <strong>Erro no Upload:</strong> {uploadError}
            </div>
        )}
        
        {/* Content based on active tab */}
        <div className="space-y-8">
            {activeTab === 'content' && (
              <>
                {/* Hero Section */}
                <fieldset className="border border-zinc-700 p-4 rounded-lg">
                    <legend className="px-2 font-bebas text-2xl">Seção Principal (Hero)</legend>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Nomes do Casal</label>
                            <input type="text" value={heroData.coupleNames} onChange={e => handleHeroChange('coupleNames', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Subtítulo</label>
                            <input type="text" value={heroData.subtitle} onChange={e => handleHeroChange('subtitle', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Posição da Imagem</label>
                            <select
                                value={heroData.imagePosition || 'center'}
                                onChange={e => handleHeroChange('imagePosition', e.target.value)}
                                className="w-full bg-zinc-800 rounded p-2"
                            >
                                <option value="center">Centro</option>
                                <option value="top">Topo</option>
                                <option value="bottom">Baixo</option>
                                <option value="left">Esquerda</option>
                                <option value="right">Direita</option>
                                <option value="top left">Canto Superior Esquerdo</option>
                                <option value="top right">Canto Superior Direito</option>
                                <option value="bottom left">Canto Inferior Esquerdo</option>
                                <option value="bottom right">Canto Inferior Direito</option>
                            </select>
                            <p className="text-xs text-zinc-500 mt-1">Isso ajuda a focar na parte mais importante da foto.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Imagem de Fundo</label>
                            <img src={heroData.imageUrl} alt="Preview" className="w-48 h-auto object-cover rounded my-2" style={{ objectPosition: heroData.imagePosition || 'center' }}/>
                            <div className="bg-zinc-800 p-3 rounded-md space-y-2">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">Enviar um arquivo:</label>
                                    {uploadingId === 'hero' ? (
                                        <p className="text-sm text-zinc-400 py-2">Enviando...</p>
                                    ) : (
                                        <input type="file" accept="image/*" onChange={e => handleHeroImageChange(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                                    )}
                                </div>
                                <p className="text-center text-xs text-zinc-500">OU</p>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">Colar URL da imagem:</label>
                                    <input 
                                        type="url" 
                                        value={heroData.imageUrl}
                                        onChange={e => handleHeroChange('imageUrl', e.target.value)}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                        className="w-full bg-zinc-700 rounded p-2 text-sm" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Our Story Section */}
                <fieldset className="border border-zinc-700 p-4 rounded-lg">
                    <legend className="px-2 font-bebas text-2xl">Nossa História (Enredo)</legend>
                    <div className="space-y-6">
                        {ourStory.map((item, index) => (
                            <div key={item.id} className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0 space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Título</label>
                                    <input type="text" value={item.title} onChange={e => handleStoryChange(index, 'title', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Descrição</label>
                                    <textarea value={item.description} onChange={e => handleStoryChange(index, 'description', e.target.value)} className="w-full bg-zinc-800 rounded p-2 h-24" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Posição da Imagem</label>
                                    <select
                                        value={item.imagePosition || 'center'}
                                        onChange={e => handleStoryChange(index, 'imagePosition', e.target.value)}
                                        className="w-full bg-zinc-800 rounded p-2"
                                    >
                                        <option value="center">Centro</option>
                                        <option value="top">Topo</option>
                                        <option value="bottom">Baixo</option>
                                        <option value="left">Esquerda</option>
                                        <option value="right">Direita</option>
                                        <option value="top left">Canto Superior Esquerdo</option>
                                        <option value="top right">Canto Superior Direito</option>
                                        <option value="bottom left">Canto Inferior Esquerdo</option>
                                        <option value="bottom right">Canto Inferior Direito</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Imagem</label>
                                    <img src={item.imageUrl} alt="Preview" className="w-40 h-auto object-cover rounded my-2" style={{ objectPosition: item.imagePosition || 'center' }}/>
                                    <div className="bg-zinc-800 p-3 rounded-md space-y-2">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-1">Enviar um arquivo:</label>
                                            {uploadingId === `story-${index}` ? (
                                                <p className="text-sm text-zinc-400 py-2">Enviando...</p>
                                            ) : (
                                                <input type="file" accept="image/*" onChange={e => handleStoryImageChange(index, e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                                            )}
                                        </div>
                                        <p className="text-center text-xs text-zinc-500">OU</p>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-1">Colar URL da imagem:</label>
                                            <input 
                                                type="url" 
                                                value={item.imageUrl}
                                                onChange={e => handleStoryChange(index, 'imageUrl', e.target.value)}
                                                placeholder="https://exemplo.com/imagem.jpg"
                                                className="w-full bg-zinc-700 rounded p-2 text-sm" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </fieldset>
                
                {/* Wedding Party Section */}
                <fieldset className="border border-zinc-700 p-4 rounded-lg">
                    <legend className="px-2 font-bebas text-2xl">Elenco (Padrinhos e Noivos)</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {weddingParty.map((person, index) => (
                            <div key={person.id} className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Nome</label>
                                    <input type="text" value={person.name} onChange={e => handlePartyChange(index, 'name', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Papel</label>
                                    <input type="text" value={person.role} onChange={e => handlePartyChange(index, 'role', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Posição da Imagem</label>
                                    <select
                                        value={person.imagePosition || 'center'}
                                        onChange={e => handlePartyChange(index, 'imagePosition', e.target.value)}
                                        className="w-full bg-zinc-800 rounded p-2"
                                    >
                                        <option value="center">Centro</option>
                                        <option value="top">Topo</option>
                                        <option value="bottom">Baixo</option>
                                        <option value="left">Esquerda</option>
                                        <option value="right">Direita</option>
                                        <option value="top left">Canto Superior Esquerdo</option>
                                        <option value="top right">Canto Superior Direito</option>
                                        <option value="bottom left">Canto Inferior Esquerdo</option>
                                        <option value="bottom right">Canto Inferior Direito</option>
                                    </select>
                                </div>
                                <div className="space-y-2 pt-2">
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Foto</label>
                                    <img src={person.imageUrl} alt="Preview" className="w-24 h-auto object-cover rounded my-2" style={{ objectPosition: person.imagePosition || 'center' }}/>
                                    <div className="bg-zinc-800 p-3 rounded-md space-y-2">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-1">Enviar um arquivo:</label>
                                            {uploadingId === `party-${index}` ? (
                                                <p className="text-sm text-zinc-400 py-2">Enviando...</p>
                                            ) : (
                                                <input type="file" accept="image/*" onChange={e => handlePartyImageChange(index, e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                                            )}
                                        </div>
                                        <p className="text-center text-xs text-zinc-500">OU</p>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-1">Colar URL da imagem:</label>
                                            <input 
                                                type="url" 
                                                value={person.imageUrl}
                                                onChange={e => handlePartyChange(index, 'imageUrl', e.target.value)}
                                                placeholder="https://exemplo.com/imagem.jpg"
                                                className="w-full bg-zinc-700 rounded p-2 text-sm" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </fieldset>
                
                {/* Event Details Section */}
                <fieldset className="border border-zinc-700 p-4 rounded-lg">
                    <legend className="px-2 font-bebas text-2xl">A Grande Estreia (Detalhes do Evento)</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {eventDetails.map((event, index) => (
                            <div key={event.id} className="space-y-2 bg-zinc-800/50 p-4 rounded-lg">
                                <h4 className="font-bebas text-xl text-red-400">{event.title}</h4>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Título</label>
                                    <input type="text" value={event.title} onChange={e => handleEventChange(index, 'title', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Data</label>
                                    <input type="text" value={event.date} onChange={e => handleEventChange(index, 'date', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Hora</label>
                                    <input type="text" value={event.time} onChange={e => handleEventChange(index, 'time', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Local</label>
                                    <input type="text" value={event.location} onChange={e => handleEventChange(index, 'location', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Endereço</label>
                                    <input type="text" value={event.address} onChange={e => handleEventChange(index, 'address', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Traje</label>
                                    <input type="text" value={event.dressCode} onChange={e => handleEventChange(index, 'dressCode', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </fieldset>
                
                {/* Gallery Images Section */}
                <fieldset className="border border-zinc-700 p-4 rounded-lg">
                    <legend className="px-2 font-bebas text-2xl">Galeria de Fotos</legend>
                     <div className="bg-zinc-800/50 p-4 rounded-lg mb-6">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Adicionar Nova Foto</label>
                        {uploadingId === 'new-gallery-image' ? (
                            <p className="text-sm text-zinc-400 py-2">Enviando...</p>
                        ) : (
                            <input type="file" accept="image/*" onChange={e => handleAddGalleryImage(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleryImages.map((image, index) => (
                            <div key={image.id} className="bg-zinc-800 p-3 rounded-lg space-y-2">
                                <img src={image.src} alt={image.alt} className="w-full h-32 object-cover rounded" />
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">URL da Imagem</label>
                                    <input type="url" value={image.src} onChange={e => handleGalleryImageChange(index, 'src', e.target.value)} className="w-full bg-zinc-700 rounded p-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">Texto Alternativo (para acessibilidade)</label>
                                    <input type="text" value={image.alt} onChange={e => handleGalleryImageChange(index, 'alt', e.target.value)} className="w-full bg-zinc-700 rounded p-2 text-sm" />
                                </div>
                                <button onClick={() => handleRemoveGalleryImage(image.id)} className="w-full bg-red-800/50 text-red-200 text-sm font-bold py-2 px-4 rounded hover:bg-red-800/80 transition-colors">
                                    Remover Foto
                                </button>
                            </div>
                        ))}
                    </div>
                </fieldset>
              </>
            )}

            {activeTab === 'gifts' && (
              <>
                 {/* Pix Config Section */}
                <fieldset className="border border-zinc-700 p-4 rounded-lg">
                    <legend className="px-2 font-bebas text-2xl">Configurações PIX</legend>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Chave PIX (E-mail, CPF/CNPJ, Telefone ou Chave Aleatória)</label>
                            <input type="text" value={pixConfig.key} onChange={e => handlePixConfigChange('key', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Nome Completo do Beneficiário (até 25 caracteres, sem acentos)</label>
                            <input type="text" maxLength={25} value={pixConfig.recipientName} onChange={e => handlePixConfigChange('recipientName', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Cidade do Beneficiário (até 15 caracteres, sem acentos, maiúsculas)</label>
                            <input type="text" maxLength={15} value={pixConfig.city} onChange={e => handlePixConfigChange('city', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                        </div>
                    </div>
                </fieldset>

                {/* Gift List Section */}
                <fieldset className="border border-zinc-700 p-4 rounded-lg">
                    <legend className="px-2 font-bebas text-2xl">Lista de Presentes</legend>
                    <div className="space-y-6">
                        {giftList.map((gift, index) => (
                            <div key={gift.id} className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div className="space-y-2">
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Presente</label>
                                    <input type="text" value={gift.name} onChange={e => handleGiftChange(index, 'name', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                    
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Preço (R$)</label>
                                    <input type="number" value={gift.price} onChange={e => handleGiftChange(index, 'price', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                                    
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Posição da Imagem</label>
                                    <select
                                        value={gift.imagePosition || 'center'}
                                        onChange={e => handleGiftChange(index, 'imagePosition', e.target.value)}
                                        className="w-full bg-zinc-800 rounded p-2"
                                    >
                                        <option value="center">Centro</option>
                                        <option value="top">Topo</option>
                                        <option value="bottom">Baixo</option>
                                        <option value="left">Esquerda</option>
                                        <option value="right">Direita</option>
                                        <option value="top left">Canto Superior Esquerdo</option>
                                        <option value="top right">Canto Superior Direito</option>
                                        <option value="bottom left">Canto Inferior Esquerdo</option>
                                        <option value="bottom right">Canto Inferior Direito</option>
                                    </select>
                            </div>
                            <div className="space-y-2">
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Imagem</label>
                                    <img src={gift.imageUrl} alt="Preview" className="w-32 h-auto object-cover rounded my-2" style={{ objectPosition: gift.imagePosition || 'center' }}/>
                                    <div className="bg-zinc-800 p-3 rounded-md space-y-2">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-1">Enviar um arquivo:</label>
                                            {uploadingId === `gift-${index}` ? (
                                                <p className="text-sm text-zinc-400 py-2">Enviando...</p>
                                            ) : (
                                                <input type="file" accept="image/*" onChange={e => handleGiftImageChange(index, e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                                            )}
                                        </div>
                                        <p className="text-center text-xs text-zinc-500">OU</p>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-1">Colar URL da imagem:</label>
                                            <input 
                                                type="url" 
                                                value={gift.imageUrl}
                                                onChange={e => handleGiftChange(index, 'imageUrl', e.target.value)}
                                                placeholder="https://exemplo.com/imagem.jpg"
                                                className="w-full bg-zinc-700 rounded p-2 text-sm" 
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveGift(gift.id)} className="!mt-4 w-full bg-red-800/50 text-red-200 text-sm font-bold py-2 px-4 rounded hover:bg-red-800/80 transition-colors">
                                        Remover Presente
                                    </button>
                            </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <button onClick={handleAddGift} className="w-full bg-green-600/80 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors">
                            Adicionar Novo Presente
                        </button>
                    </div>
                </fieldset>
              </>
            )}
            
            {activeTab === 'rsvp' && (
              <fieldset className="border border-zinc-700 p-4 rounded-lg">
                <legend className="px-2 font-bebas text-2xl">Confirmações de Presença</legend>
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-800/50 p-4 rounded-lg">
                            <div className="font-bebas text-4xl">{rsvpCounts.yes}</div>
                            <div className="text-sm uppercase text-green-300">Sim</div>
                        </div>
                        <div className="bg-red-800/50 p-4 rounded-lg">
                            <div className="font-bebas text-4xl">{rsvpCounts.no}</div>
                             <div className="text-sm uppercase text-red-300">Não</div>
                        </div>
                    </div>
                    
                    {/* Response List */}
                    <div className="bg-zinc-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                        {rsvpResponses.length > 0 ? (
                           <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-700">
                                        <th className="p-2 text-sm font-semibold text-zinc-400">Nome do Convidado</th>
                                        <th className="p-2 text-sm font-semibold text-zinc-400 text-center">Resposta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rsvpResponses.map(response => (
                                        <tr key={response.id} className="border-b border-zinc-700/50 last:border-b-0">
                                            <td className="p-3">{response.name}</td>
                                            <td className="p-3 text-center">
                                                {response.attendance === 'yes' ? (
                                                    <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full">SIM</span>
                                                ) : (
                                                    <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full">NÃO</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                           </table>
                        ) : (
                            <p className="text-center text-zinc-500 py-8">Nenhuma confirmação recebida ainda.</p>
                        )}
                    </div>
                </div>
              </fieldset>
            )}

            <p className="text-center text-sm text-zinc-500 pt-4">As alterações são salvas automaticamente no banco de dados.</p>
        </div>
      </div>
    </div>
  );
};
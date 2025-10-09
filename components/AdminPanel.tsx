import React, { useState, useMemo } from 'react';
import type { useSiteData } from '../hooks/useSiteData';
import type { Gift, PixConfig } from '../types';

type SiteData = ReturnType<typeof useSiteData>;

interface AdminPanelProps {
  siteData: SiteData;
  onClose: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

type AdminTab = 'content' | 'gifts' | 'rsvp';

export const AdminPanel: React.FC<AdminPanelProps> = ({ siteData, onClose }) => {
    const { 
        heroData, setHeroData, 
        ourStory, setOurStory,
        weddingParty, setWeddingParty,
        giftList, setGiftList,
        pixConfig, setPixConfig,
        rsvpResponses,
    } = siteData;
    const [activeTab, setActiveTab] = useState<AdminTab>('content');

    const handleHeroChange = (field: keyof typeof heroData, value: string) => {
        setHeroData({ ...heroData, [field]: value });
    };
    
    const handleHeroImageChange = async (file: File | null) => {
        if (!file) return;
        const base64 = await fileToBase64(file);
        handleHeroChange('imageUrl', base64);
    };

    const handleStoryChange = (index: number, field: 'title' | 'description', value: string) => {
        const newStory = [...ourStory];
        newStory[index] = { ...newStory[index], [field]: value };
        setOurStory(newStory);
    };
    
    const handleStoryImageChange = async (index: number, file: File | null) => {
        if (!file) return;
        const base64 = await fileToBase64(file);
        const newStory = [...ourStory];
        newStory[index] = { ...newStory[index], imageUrl: base64 };
        setOurStory(newStory);
    };
    
    const handlePartyChange = (index: number, field: 'name' | 'role', value: string) => {
        const newParty = [...weddingParty];
        newParty[index] = { ...newParty[index], [field]: value };
        setWeddingParty(newParty);
    };

    const handlePartyImageChange = async (index: number, file: File | null) => {
        if (!file) return;
        const base64 = await fileToBase64(file);
        const newParty = [...weddingParty];
        newParty[index] = { ...newParty[index], imageUrl: base64 };
        setWeddingParty(newParty);
    };

    const handleGiftChange = (index: number, field: keyof Omit<Gift, 'id' | 'imageUrl'>, value: string | number) => {
        const newGiftList = [...giftList];
        const finalValue = field === 'price' ? Number(value) : value;
        newGiftList[index] = { ...newGiftList[index], [field]: finalValue };
        setGiftList(newGiftList);
    };

    const handleGiftImageChange = async (index: number, file: File | null) => {
        if (!file) return;
        const base64 = await fileToBase64(file);
        const newGiftList = [...giftList];
        newGiftList[index] = { ...newGiftList[index], imageUrl: base64 };
        setGiftList(newGiftList);
    };

    const handleAddGift = () => {
        const newGift: Gift = {
            id: Date.now(),
            name: 'Novo Presente',
            price: 0,
            imageUrl: 'https://placehold.co/400x300/27272a/e5e5e5?text=Imagem',
        };
        // FIX: The setter from useSiteData does not support functional updates. Pass the new value directly.
        setGiftList([...giftList, newGift]);
    };

    const handleRemoveGift = (id: number) => {
        // FIX: The setter from useSiteData does not support functional updates. Pass the new value directly.
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
            <h2 className="font-bebas text-4xl text-red-500">Painel de Administração</h2>
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
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Imagem de Fundo</label>
                            <img src={heroData.imageUrl} alt="Preview" className="w-48 h-auto object-cover rounded my-2"/>
                            <input type="file" accept="image/*" onChange={e => handleHeroImageChange(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                        </div>
                    </div>
                </fieldset>

                {/* Our Story Section */}
                <fieldset className="border border-zinc-700 p-4 rounded-lg">
                    <legend className="px-2 font-bebas text-2xl">Nossa História (Enredo)</legend>
                    <div className="space-y-6">
                        {ourStory.map((item, index) => (
                            <div key={item.id} className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0">
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Título</label>
                                <input type="text" value={item.title} onChange={e => handleStoryChange(index, 'title', e.target.value)} className="w-full bg-zinc-800 rounded p-2 mb-2" />
                                
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Descrição</label>
                                <textarea value={item.description} onChange={e => handleStoryChange(index, 'description', e.target.value)} className="w-full bg-zinc-800 rounded p-2 h-24 mb-2" />

                                <label className="block text-sm font-medium text-zinc-400 mb-1">Imagem</label>
                                <img src={item.imageUrl} alt="Preview" className="w-40 h-auto object-cover rounded my-2"/>
                                <input type="file" accept="image/*" onChange={e => handleStoryImageChange(index, e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
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
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome</label>
                                <input type="text" value={person.name} onChange={e => handlePartyChange(index, 'name', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />

                                <label className="block text-sm font-medium text-zinc-400 mb-1">Papel</label>
                                <input type="text" value={person.role} onChange={e => handlePartyChange(index, 'role', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />

                                <label className="block text-sm font-medium text-zinc-400 mb-1">Foto</label>
                                <img src={person.imageUrl} alt="Preview" className="w-24 h-auto object-cover rounded my-2"/>
                                <input type="file" accept="image/*" onChange={e => handlePartyImageChange(index, e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
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
                            <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Presente</label>
                                    <input type="text" value={gift.name} onChange={e => handleGiftChange(index, 'name', e.target.value)} className="w-full bg-zinc-800 rounded p-2 mb-2" />
                                    
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Preço (R$)</label>
                                    <input type="number" value={gift.price} onChange={e => handleGiftChange(index, 'price', e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                            </div>
                            <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Imagem</label>
                                    <img src={gift.imageUrl} alt="Preview" className="w-32 h-auto object-cover rounded my-2"/>
                                    <input type="file" accept="image/*" onChange={e => handleGiftImageChange(index, e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />

                                    <button onClick={() => handleRemoveGift(gift.id)} className="mt-4 w-full bg-red-800/50 text-red-200 text-sm font-bold py-2 px-4 rounded hover:bg-red-800/80 transition-colors">
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
import { useState, useEffect, useCallback } from 'react';
import type { SiteData, HeroData, StoryItem, Person, EventDetails, GalleryImage, Gift, PixConfig, Guest } from '../types';
import { DEFAULT_SITE_DATA } from '../constants';

const API_ENDPOINT = '/api/site-data';
const RSVP_ENDPOINT = '/api/rsvp';

export const useSiteData = () => {
    const [data, setData] = useState<SiteData>(DEFAULT_SITE_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConfigError, setIsConfigError] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsConfigError(false);
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                if (response.status === 404) {
                    // Se não encontrar dados (primeira vez), salva os dados padrão
                    console.log("No data found, initializing with default data...");
                    await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(DEFAULT_SITE_DATA)
                    });
                    setData(DEFAULT_SITE_DATA);
                } else {
                     const errorData = await response.json();
                     throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
                }
            } else {
                const fetchedData: SiteData | null = await response.json();
                if (fetchedData) {
                    // Merge robusto para garantir a integridade dos dados, especialmente após atualizações
                    const mergedData: SiteData = {
                        heroData: { ...DEFAULT_SITE_DATA.heroData, ...fetchedData.heroData },
                        ourStory: Array.isArray(fetchedData.ourStory) ? fetchedData.ourStory : DEFAULT_SITE_DATA.ourStory,
                        weddingParty: Array.isArray(fetchedData.weddingParty) ? fetchedData.weddingParty : DEFAULT_SITE_DATA.weddingParty,
                        eventDetails: Array.isArray(fetchedData.eventDetails) ? fetchedData.eventDetails : DEFAULT_SITE_DATA.eventDetails,
                        galleryImages: Array.isArray(fetchedData.galleryImages) ? fetchedData.galleryImages : DEFAULT_SITE_DATA.galleryImages,
                        giftList: Array.isArray(fetchedData.giftList) ? fetchedData.giftList : DEFAULT_SITE_DATA.giftList,
                        pixConfig: { ...DEFAULT_SITE_DATA.pixConfig, ...fetchedData.pixConfig },
                        guestList: Array.isArray(fetchedData.guestList) ? fetchedData.guestList : DEFAULT_SITE_DATA.guestList,
                    };
                    setData(mergedData);
                } else {
                    // Se o banco retornar null, trata como "não encontrado"
                    console.log("KV returned null, initializing with default data...");
                    await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(DEFAULT_SITE_DATA)
                    });
                    setData(DEFAULT_SITE_DATA);
                }
            }
        } catch (e) {
            console.error("Failed to fetch site data:", e);
            const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
            // Detecção de erro aprimorada para problemas de configuração
            if (
                errorMessage.toLowerCase().includes('kv_url') ||
                errorMessage.toLowerCase().includes('api_key') ||
                errorMessage.toLowerCase().includes('variáveis de ambiente') ||
                errorMessage.toLowerCase().includes('failed to fetch')
            ) {
                 setIsConfigError(true);
                 setError("Não foi possível conectar ao servidor. Isso geralmente acontece quando o banco de dados (Vercel KV) ou a chave da API (Gemini) não estão configurados. Siga os passos para resolver.");
            } else {
                 setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const saveData = useCallback(async (updatedData: SiteData) => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                throw new Error('Failed to save data');
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to save data');
        }
    }, []);

    const updateAndSave = useCallback(<K extends keyof SiteData>(key: K, value: SiteData[K]) => {
        setData(prevData => {
            const newData = { ...prevData, [key]: value };
            saveData(newData); // Salva os dados completos na API
            return newData;
        });
    }, [saveData]);

    const updateGuestAttendance = useCallback(async (guestId: number, attendance: 'yes' | 'no') => {
        const originalGuestList = data.guestList;
        // Atualiza o estado local imediatamente para feedback rápido
        setData(prevData => ({
            ...prevData,
            guestList: prevData.guestList.map(guest => 
                guest.id === guestId ? { ...guest, attendance } : guest
            )
        }));

        // Envia para a API para persistir
        try {
            const response = await fetch(RSVP_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestId, attendance })
            });
            if (!response.ok) {
                throw new Error('Failed to submit RSVP');
            }
        } catch (err) {
             console.error(err);
             setError(err instanceof Error ? err.message : 'Failed to submit RSVP');
             // Se falhar, reverte o estado
             setData(prevData => ({
                ...prevData,
                guestList: originalGuestList,
             }));
        }
    }, [data.guestList]);

    return {
        heroData: data.heroData,
        ourStory: data.ourStory,
        weddingParty: data.weddingParty,
        eventDetails: data.eventDetails,
        galleryImages: data.galleryImages,
        giftList: data.giftList,
        pixConfig: data.pixConfig,
        guestList: data.guestList,
        
        setHeroData: (value: HeroData) => updateAndSave('heroData', value),
        setOurStory: (value: StoryItem[]) => updateAndSave('ourStory', value),
        setWeddingParty: (value: Person[]) => updateAndSave('weddingParty', value),
        setEventDetails: (value: EventDetails[]) => updateAndSave('eventDetails', value),
        setGalleryImages: (value: GalleryImage[]) => updateAndSave('galleryImages', value),
        setGiftList: (value: Gift[]) => updateAndSave('giftList', value),
        setPixConfig: (value: PixConfig) => updateAndSave('pixConfig', value),
        setGuestList: (value: Guest[]) => updateAndSave('guestList', value),
        
        updateGuestAttendance,
        isLoading,
        error,
        isConfigError,
        fetchData,
    };
};
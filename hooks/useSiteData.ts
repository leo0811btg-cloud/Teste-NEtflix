import { useState, useEffect, useCallback, useRef } from 'react';
import type { SiteData, HeroData, StoryItem, Person, EventDetails, GalleryImage, Gift, PixConfig, RsvpResponse } from '../types';

// Função de Debounce para evitar múltiplas chamadas de API em sequência
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const debounced = (...args: Parameters<F>) => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), waitFor);
    };
    return debounced;
};

export const useSiteData = () => {
    const [data, setData] = useState<SiteData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Ref para evitar o salvamento inicial na primeira carga de dados
    const isInitialLoad = useRef(true);

    const fetchData = useCallback(async (isRetry = false) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/site-data');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar os dados do site.');
            }
            const fetchedData = await response.json();
            setData(fetchedData);
            isInitialLoad.current = true; // Reseta o flag a cada busca bem-sucedida
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
            setError(errorMessage);
            console.error(err);
             if (!isRetry) {
                setTimeout(() => fetchData(true), 3000); // Tenta buscar novamente após 3s
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const saveData = useCallback(async (newData: SiteData) => {
        try {
            await fetch('/api/site-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
        } catch (err) {
            console.error("Falha ao salvar os dados", err);
            setError("Não foi possível salvar as alterações. Verifique sua conexão.");
        }
    }, []);

    const debouncedSave = useCallback(debounce(saveData, 1500), [saveData]);

    // Efeito para salvar dados quando eles mudam
    useEffect(() => {
        if (!data || isInitialLoad.current) {
            if (data) {
                isInitialLoad.current = false;
            }
            return;
        }
        debouncedSave(data);
    }, [data, debouncedSave]);
    
    // Setter genérico para atualizar qualquer parte dos dados do site
    const updateData = <K extends keyof SiteData>(key: K, value: SiteData[K]) => {
        setData(prev => (prev ? { ...prev, [key]: value } : null));
    };

    const emptyHero: HeroData = { coupleNames: 'Carregando...', subtitle: '', imageUrl: '' };
    const emptyPix: PixConfig = { key: '', recipientName: '', city: '' };

    return {
        heroData: data?.heroData ?? emptyHero,
        setHeroData: (value: HeroData) => updateData('heroData', value),
        ourStory: data?.ourStory ?? [],
        setOurStory: (value: StoryItem[]) => updateData('ourStory', value),
        weddingParty: data?.weddingParty ?? [],
        setWeddingParty: (value: Person[]) => updateData('weddingParty', value),
        eventDetails: data?.eventDetails ?? [],
        setEventDetails: (value: EventDetails[]) => updateData('eventDetails', value),
        galleryImages: data?.galleryImages ?? [],
        setGalleryImages: (value: GalleryImage[]) => updateData('galleryImages', value),
        giftList: data?.giftList ?? [],
        setGiftList: (value: Gift[]) => updateData('giftList', value),
        pixConfig: data?.pixConfig ?? emptyPix,
        setPixConfig: (value: PixConfig) => updateData('pixConfig', value),
        rsvpResponses: data?.rsvpResponses ?? [],
        setRsvpResponses: (value: RsvpResponse[]) => updateData('rsvpResponses', value),
        
        isLoading,
        error,
        fetchData,
    };
};
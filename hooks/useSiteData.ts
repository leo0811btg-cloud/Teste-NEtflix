import { useState, useEffect, useCallback } from 'react';
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

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/site-data');
            if (!response.ok) {
                let errorMessage = `Erro na API: ${response.status}`;
                try {
                    // Tenta extrair uma mensagem de erro mais específica do corpo da resposta
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.details || errorMessage;
                } catch (e) {
                    console.warn("A resposta de erro da API não era JSON.");
                }
                throw new Error(errorMessage);
            }
            const fetchedData = await response.json();
            setData(fetchedData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const saveData = useCallback(async (newData: SiteData) => {
        try {
            const response = await fetch('/api/site-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
            if (!response.ok) {
                throw new Error('Falha ao salvar os dados na API.');
            }
        } catch (err) {
            console.error("Falha ao salvar os dados", err);
            setError("Não foi possível salvar as alterações. Verifique sua conexão.");
        }
    }, []);

    const debouncedSave = useCallback(debounce(saveData, 1500), [saveData]);
    
    // Setter genérico que atualiza o estado local e dispara o salvamento
    const updateData = <K extends keyof SiteData>(key: K, value: SiteData[K]) => {
        setData(prevData => {
            if (!prevData) return null;
            
            const newData = { ...prevData, [key]: value };
            // Aciona o salvamento com o novo estado de dados
            debouncedSave(newData);
            
            return newData;
        });
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
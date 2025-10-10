import { useState, useEffect, useCallback, useRef } from 'react';
import type { SiteData, HeroData, StoryItem, Person, EventDetails, GalleryImage, Gift, PixConfig, RsvpResponse } from '../types';
import { DEFAULT_SITE_DATA } from '../constants';

export const useSiteData = () => {
    const [data, setData] = useState<SiteData>(DEFAULT_SITE_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const debounceTimeout = useRef<number | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/site-data');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to fetch site data');
            }
            const fetchedData: SiteData = await response.json();
            // Ensure rsvpResponses is always an array to prevent runtime errors
            fetchedData.rsvpResponses = fetchedData.rsvpResponses || [];
            setData(fetchedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const saveData = useCallback((updatedData: SiteData) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = window.setTimeout(async () => {
            try {
                const response = await fetch('/api/site-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || errorData.error || 'Failed to save site data');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred while saving');
            }
        }, 1500);
    }, []);

    const updateAndSaveData = useCallback(<K extends keyof SiteData>(key: K, value: SiteData[K]) => {
        setData(prevData => {
            const newData = { ...prevData, [key]: value };
            saveData(newData);
            return newData;
        });
    }, [saveData]);

    const addRsvpResponse = useCallback(async (newResponse: Omit<RsvpResponse, 'id'>) => {
        const fullResponse: RsvpResponse = { ...newResponse, id: Date.now() };

        // Optimistically update UI for a better user experience
        setData(prevData => ({
            ...prevData,
            rsvpResponses: [...(prevData.rsvpResponses || []), fullResponse]
        }));

        try {
            const response = await fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fullResponse),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to submit RSVP');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while submitting RSVP');
            // Revert optimistic update on failure to keep UI consistent with the database
            setData(prevData => ({
                ...prevData,
                rsvpResponses: prevData.rsvpResponses.filter(r => r.id !== fullResponse.id)
            }));
            throw err; // Re-throw the error so the modal can display it
        }
    }, []);

    return {
        heroData: data.heroData,
        ourStory: data.ourStory,
        weddingParty: data.weddingParty,
        eventDetails: data.eventDetails,
        galleryImages: data.galleryImages,
        giftList: data.giftList,
        pixConfig: data.pixConfig,
        rsvpResponses: data.rsvpResponses,
        
        setHeroData: (value: HeroData) => updateAndSaveData('heroData', value),
        setOurStory: (value: StoryItem[]) => updateAndSaveData('ourStory', value),
        setWeddingParty: (value: Person[]) => updateAndSaveData('weddingParty', value),
        setEventDetails: (value: EventDetails[]) => updateAndSaveData('eventDetails', value),
        setGalleryImages: (value: GalleryImage[]) => updateAndSaveData('galleryImages', value),
        setGiftList: (value: Gift[]) => updateAndSaveData('giftList', value),
        setPixConfig: (value: PixConfig) => updateAndSaveData('pixConfig', value),
        setRsvpResponses: (value: RsvpResponse[]) => updateAndSaveData('rsvpResponses', value),
        
        addRsvpResponse,
        isLoading,
        error,
        fetchData,
    };
};

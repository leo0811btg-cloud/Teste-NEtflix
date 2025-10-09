
import { useState } from 'react';
import { OUR_STORY, WEDDING_PARTY, EVENT_DETAILS, GALLERY_IMAGES, GIFT_LIST } from '../constants';
import type { StoryItem, Person, EventDetails as EventDetailsType, GalleryImage, HeroData, Gift, PixConfig, RsvpResponse } from '../types';

export const useSiteData = () => {
    const [heroData, setHeroData] = useState<HeroData>({
        coupleNames: 'Maria & João',
        subtitle: 'Vão se casar!',
        imageUrl: 'https://picsum.photos/1920/1080?random=0',
    });
    const [ourStory, setOurStory] = useState<StoryItem[]>(OUR_STORY);
    const [weddingParty, setWeddingParty] = useState<Person[]>(WEDDING_PARTY);
    const [eventDetails, setEventDetails] = useState<EventDetailsType[]>(EVENT_DETAILS);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(GALLERY_IMAGES);
    const [giftList, setGiftList] = useState<Gift[]>(GIFT_LIST);
    const [pixConfig, setPixConfig] = useState<PixConfig>({
        key: 'maria.joao.casamento@email.com',
        recipientName: 'Maria Silva',
        city: 'SAO PAULO',
    });
    const [rsvpResponses, setRsvpResponses] = useState<RsvpResponse[]>([]);

    return {
        heroData,
        setHeroData,
        ourStory,
        setOurStory,
        weddingParty,
        setWeddingParty,
        eventDetails,
        setEventDetails,
        galleryImages,
        setGalleryImages,
        giftList,
        setGiftList,
        pixConfig,
        setPixConfig,
        rsvpResponses,
        setRsvpResponses,
    };
};

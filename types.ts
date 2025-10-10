import type React from 'react';

export interface Person {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  imagePosition?: string;
}

export interface StoryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imagePosition?: string;
}

export interface EventDetails {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  dressCode: string;
  icon: 'ceremony' | 'party'; // Alterado para ser serializável
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface HeroData {
  coupleNames: string;
  subtitle: string;
  imageUrl: string;
  imagePosition?: string;
}

export interface Gift {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  imagePosition?: string;
}

export interface PixConfig {
  key: string;
  recipientName: string;
  city: string;
}

export interface RsvpResponse {
  id: number;
  name: string;
  attendance: 'yes' | 'no';
}

// Novo tipo para agrupar todos os dados do site
export interface SiteData {
    heroData: HeroData;
    ourStory: StoryItem[];
    weddingParty: Person[];
    eventDetails: EventDetails[];
    galleryImages: GalleryImage[];
    giftList: Gift[];
    pixConfig: PixConfig;
    rsvpResponses: RsvpResponse[];
}
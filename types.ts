import type React from 'react';

export interface Person {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
}

export interface StoryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface EventDetails {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  dressCode: string;
  // FIX: Changed JSX.Element to React.ReactElement to resolve namespace error.
  icon: React.ReactElement;
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
}

export interface Gift {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
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

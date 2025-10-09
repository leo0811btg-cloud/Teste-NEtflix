
import React from 'react';
import type { Person, StoryItem, EventDetails, GalleryImage, Gift } from './types';

export const WEDDING_PARTY: Person[] = [
  { id: 1, name: 'Maria Silva', role: 'Noiva', imageUrl: 'https://picsum.photos/400/500?random=1' },
  { id: 2, name: 'João Pereira', role: 'Noivo', imageUrl: 'https://picsum.photos/400/500?random=2' },
  { id: 3, name: 'Ana Costa', role: 'Madrinha', imageUrl: 'https://picsum.photos/400/500?random=3' },
  { id: 4, name: 'Pedro Martins', role: 'Padrinho', imageUrl: 'https://picsum.photos/400/500?random=4' },
  { id: 5, name: 'Beatriz Almeida', role: 'Madrinha', imageUrl: 'https://picsum.photos/400/500?random=5' },
  { id: 6, name: 'Lucas Santos', role: 'Padrinho', imageUrl: 'https://picsum.photos/400/500?random=6' },
  { id: 7, name: 'Sofia Ferreira', role: 'Dama de Honra', imageUrl: 'https://picsum.photos/400/500?random=7' },
  { id: 8, name: 'Tiago Ribeiro', role: 'Pajem', imageUrl: 'https://picsum.photos/400/500?random=8' },
];

export const OUR_STORY: StoryItem[] = [
  { id: 1, title: 'O Primeiro Encontro', description: 'Nossos caminhos se cruzaram em uma cafeteria charmosa, onde uma conversa sobre livros se tornou o início de tudo.', imageUrl: 'https://picsum.photos/800/450?random=9' },
  { id: 2, title: 'A Primeira Viagem', description: 'Exploramos as paisagens da serra, e foi lá, em meio à natureza, que percebemos que nossa aventura estava apenas começando.', imageUrl: 'https://picsum.photos/800/450?random=10' },
  { id: 3, title: 'O Pedido', description: 'Em um jantar sob as estrelas, com o som das ondas ao fundo, veio a pergunta que mudaria nossas vidas para sempre.', imageUrl: 'https://picsum.photos/800/450?random=11' },
  { id: 4, title: 'O "Sim"', description: 'Agora, estamos prontos para o nosso "felizes para sempre" e mal podemos esperar para celebrar com vocês!', imageUrl: 'https://picsum.photos/800/450?random=12' },
];

const CeremonyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PartyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14h6"/>
    </svg>
);

export const EVENT_DETAILS: EventDetails[] = [
  { id: 1, title: 'Cerimônia', date: '25 de Dezembro, 2024', time: '16:00', location: 'Igreja Matriz', address: 'Rua Principal, 123, Cidade', dressCode: 'Traje Social', icon: <CeremonyIcon /> },
  { id: 2, title: 'Recepção', date: '25 de Dezembro, 2024', time: '18:00', location: 'Salão de Festas Vista Linda', address: 'Av. das Flores, 456, Cidade', dressCode: 'Traje Social', icon: <PartyIcon /> },
];

export const GALLERY_IMAGES: GalleryImage[] = [
    { id: 1, src: 'https://picsum.photos/800/600?random=13', alt: 'Foto do casal 1' },
    { id: 2, src: 'https://picsum.photos/800/600?random=14', alt: 'Foto do casal 2' },
    { id: 3, src: 'https://picsum.photos/800/600?random=15', alt: 'Foto do casal 3' },
    { id: 4, src: 'https://picsum.photos/800/600?random=16', alt: 'Foto do casal 4' },
    { id: 5, src: 'https://picsum.photos/800/600?random=17', alt: 'Foto do casal 5' },
    { id: 6, src: 'https://picsum.photos/800/600?random=18', alt: 'Foto do casal 6' },
];

export const GIFT_LIST: Gift[] = [
    { id: 1, name: 'Cotas para a Lua de Mel', price: 100, imageUrl: 'https://picsum.photos/400/300?random=20' },
    { id: 2, name: 'Conjunto de Panelas', price: 500, imageUrl: 'https://picsum.photos/400/300?random=21' },
    { id: 3, name: 'Jantar Romântico', price: 300, imageUrl: 'https://picsum.photos/400/300?random=22' },
    { id: 4, name: 'Air Fryer', price: 450, imageUrl: 'https://picsum.photos/400/300?random=23' },
    { id: 5, name: 'Aspirador de Pó Robô', price: 1500, imageUrl: 'https://picsum.photos/400/300?random=24' },
    { id: 6, name: 'Jogo de Cama', price: 250, imageUrl: 'https://picsum.photos/400/300?random=25' },
];

export const WEDDING_DATE = '2024-12-25T16:00:00';

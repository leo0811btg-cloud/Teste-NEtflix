import type { SiteData } from './types';

export const WEDDING_DATE = '2024-12-25T16:00:00';

export const DEFAULT_SITE_DATA: SiteData = {
  heroData: {
    coupleNames: 'Maria & João',
    subtitle: 'Vão se casar!',
    imageUrl: 'https://picsum.photos/1920/1080?random=0',
  },
  ourStory: [
    { id: 1, title: 'O Primeiro Encontro', description: 'Nossos caminhos se cruzaram em uma cafeteria charmosa, onde uma conversa sobre livros se tornou o início de tudo.', imageUrl: 'https://picsum.photos/800/450?random=9' },
    { id: 2, title: 'A Primeira Viagem', description: 'Exploramos as paisagens da serra, e foi lá, em meio à natureza, que percebemos que nossa aventura estava apenas começando.', imageUrl: 'https://picsum.photos/800/450?random=10' },
    { id: 3, title: 'O Pedido', description: 'Em um jantar sob as estrelas, com o som das ondas ao fundo, veio a pergunta que mudaria nossas vidas para sempre.', imageUrl: 'https://picsum.photos/800/450?random=11' },
    { id: 4, title: 'O "Sim"', description: 'Agora, estamos prontos para o nosso "felizes para sempre" e mal podemos esperar para celebrar com vocês!', imageUrl: 'https://picsum.photos/800/450?random=12' },
  ],
  weddingParty: [
    { id: 1, name: 'Maria Silva', role: 'Noiva', imageUrl: 'https://picsum.photos/400/500?random=1' },
    { id: 2, name: 'João Pereira', role: 'Noivo', imageUrl: 'https://picsum.photos/400/500?random=2' },
    { id: 3, name: 'Ana Costa', role: 'Madrinha', imageUrl: 'https://picsum.photos/400/500?random=3' },
    { id: 4, name: 'Pedro Martins', role: 'Padrinho', imageUrl: 'https://picsum.photos/400/500?random=4' },
    { id: 5, name: 'Beatriz Almeida', role: 'Madrinha', imageUrl: 'https://picsum.photos/400/500?random=5' },
    { id: 6, name: 'Lucas Santos', role: 'Padrinho', imageUrl: 'https://picsum.photos/400/500?random=6' },
    { id: 7, name: 'Sofia Ferreira', role: 'Dama de Honra', imageUrl: 'https://picsum.photos/400/500?random=7' },
    { id: 8, name: 'Tiago Ribeiro', role: 'Pajem', imageUrl: 'https://picsum.photos/400/500?random=8' },
  ],
  eventDetails: [
    { id: 1, title: 'Cerimônia', date: '13 de Dezembro, 2025', time: '16:00', location: 'Chacara Rinald´s', address: 'Rua Olívio Xavier Duque, 191- Pres. Epitácio-SP', dressCode: 'Traje Social', icon: 'ceremony' },
    { id: 2, title: 'Recepção', date: '13 de Dezembro, 2025', time: '17:30', location: 'Chacara Rinald´s', address: 'Rua Olívio Xavier Duque, 191- Pres. Epitácio-SP', dressCode: 'Traje Social', icon: 'party' },
  ],
  galleryImages: [
      { id: 1, src: 'https://picsum.photos/800/600?random=13', alt: 'Foto do casal 1' },
      { id: 2, src: 'https://picsum.photos/800/600?random=14', alt: 'Foto do casal 2' },
      { id: 3, src: 'https://picsum.photos/800/600?random=15', alt: 'Foto do casal 3' },
      { id: 4, src: 'https://picsum.photos/800/600?random=16', alt: 'Foto do casal 4' },
      { id: 5, src: 'https://picsum.photos/800/600?random=17', alt: 'Foto do casal 5' },
      { id: 6, src: 'https://picsum.photos/800/600?random=18', alt: 'Foto do casal 6' },
  ],
  giftList: [
      { id: 1, name: 'Cotas para a Lua de Mel', price: 100, imageUrl: 'https://picsum.photos/400/300?random=20' },
      { id: 2, name: 'Conjunto de Panelas', price: 500, imageUrl: 'https://picsum.photos/400/300?random=21' },
      { id: 3, name: 'Jantar Romântico', price: 300, imageUrl: 'https://picsum.photos/400/300?random=22' },
      { id: 4, name: 'Air Fryer', price: 450, imageUrl: 'https://picsum.photos/400/300?random=23' },
      { id: 5, name: 'Aspirador de Pó Robô', price: 1500, imageUrl: 'https://picsum.photos/400/300?random=24' },
      { id: 6, name: 'Jogo de Cama', price: 250, imageUrl: 'https://picsum.photos/400/300?random=25' },
  ],
  pixConfig: {
      key: 'maria.joao.casamento@email.com',
      recipientName: 'Maria Silva',
      city: 'SAO PAULO',
  },
  rsvpResponses: [],
};

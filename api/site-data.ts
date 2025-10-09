import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

// Type definitions moved directly into the API route to ensure it's self-contained.
// This prevents build issues on Vercel where functions can't find external files.
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
  icon: 'ceremony' | 'party';
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


// Moved DEFAULT_SITE_DATA directly into the API route to avoid importing a .tsx file in a Node.js environment.
const DEFAULT_SITE_DATA: SiteData = {
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
    { id: 1, title: 'Cerimônia', date: '25 de Dezembro, 2024', time: '16:00', location: 'Igreja Matriz', address: 'Rua Principal, 123, Cidade', dressCode: 'Traje Social', icon: 'ceremony' },
    { id: 2, title: 'Recepção', date: '25 de Dezembro, 2024', time: '18:00', location: 'Salão de Festas Vista Linda', address: 'Av. das Flores, 456, Cidade', dressCode: 'Traje Social', icon: 'party' },
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
    console.error("Missing Vercel KV environment variables.");
    return res.status(500).json({ 
      error: 'Configuração do Servidor Incompleta', 
      details: 'As variáveis de ambiente para a conexão com o banco de dados não foram encontradas. Por favor, configure-as no painel da Vercel.' 
    });
  }
  
  if (req.method === 'GET') {
    try {
      // Tenta buscar os dados do Vercel KV
      let siteData: SiteData | null = await kv.get('sitedata');

      // Se não houver dados, inicializa com os dados padrão e salva no KV
      if (!siteData) {
        siteData = DEFAULT_SITE_DATA;
        await kv.set('sitedata', siteData);
      }

      return res.status(200).json(siteData);
    } catch (error) {
      console.error('Erro ao buscar dados do site:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
      return res.status(500).json({ error: 'Falha ao buscar os dados do site.', details: errorMessage });
    }
  }

  if (req.method === 'POST') {
    try {
      const newData = req.body;
      if (!newData) {
        return res.status(400).json({ error: 'Nenhum dado fornecido para salvar.' });
      }
      // Sobrescreve os dados existentes com os novos dados
      await kv.set('sitedata', newData);
      return res.status(200).json({ success: true, message: 'Dados salvos com sucesso.' });
    } catch (error) {
      console.error('Erro ao salvar dados do site:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
      return res.status(500).json({ error: 'Falha ao salvar os dados do site.', details: errorMessage });
    }
  }

  // Lida com outros métodos HTTP não permitidos
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Método ${req.method} não permitido.` });
}
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
    console.error("Missing Vercel KV environment variables.");
    return res.status(500).json({ 
      error: 'Configuração do Servidor Incompleta', 
      details: 'As variáveis de ambiente para a conexão com o banco de dados não foram encontradas. Por favor, configure-as no painel da Vercel.' 
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const newRsvp: RsvpResponse = req.body;
    if (!newRsvp || !newRsvp.name || !newRsvp.attendance) {
      return res.status(400).json({ error: 'Dados de RSVP inválidos.' });
    }

    // Busca o objeto de dados completo do site
    const siteData: SiteData | null = await kv.get('sitedata');
    if (!siteData) {
        // Isso pode acontecer se ninguém acessou o site para inicializar os dados
        return res.status(500).json({ error: 'Os dados do site ainda não foram inicializados. Tente novamente em alguns instantes.' });
    }

    // Adiciona a nova confirmação à lista existente
    const updatedRsvps = [...(siteData.rsvpResponses || []), newRsvp];
    const updatedSiteData: SiteData = { ...siteData, rsvpResponses: updatedRsvps };
    
    // Salva o objeto de dados completo de volta no KV
    await kv.set('sitedata', updatedSiteData);

    return res.status(200).json({ success: true, message: 'RSVP confirmado com sucesso.' });
  } catch (error) {
    console.error('Erro ao salvar RSVP:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
    return res.status(500).json({ error: 'Falha ao salvar o RSVP.', details: errorMessage });
  }
}
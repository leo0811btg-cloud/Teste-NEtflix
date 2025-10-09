import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import type { SiteData, RsvpResponse } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
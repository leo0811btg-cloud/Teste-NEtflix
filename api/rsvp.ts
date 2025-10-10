import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import type { SiteData, RsvpResponse } from '../types';

const SITE_DATA_KEY = 'siteData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
        return res.status(500).json({ 
            error: 'Configuração do Servidor Incompleta',
            details: 'As variáveis de ambiente para o Vercel KV não foram encontradas. Por favor, conecte um banco de dados KV na aba "Storage" do seu projeto na Vercel.'
        });
    }

    if (req.method === 'POST') {
        try {
            const newRsvp: RsvpResponse = req.body;
            if (!newRsvp || !newRsvp.name || !newRsvp.attendance) {
                 return res.status(400).json({ error: 'Invalid RSVP data provided.' });
            }

            // Pega os dados atuais para não sobrescrever outras informações
            const currentData = await kv.get<SiteData>(SITE_DATA_KEY);
            if (!currentData) {
                return res.status(404).json({ error: 'Site data not found. Cannot add RSVP.' });
            }

            // Adiciona a nova resposta
            const updatedRsvps = [...(currentData.rsvpResponses || []), newRsvp];
            
            // Cria o novo objeto de dados completo
            const newData: SiteData = {
                ...currentData,
                rsvpResponses: updatedRsvps
            };

            // Salva tudo de volta
            await kv.set(SITE_DATA_KEY, newData);

            return res.status(200).json({ message: 'RSVP received successfully.' });

        } catch (error) {
            console.error('KV RSVP Error:', error);
            return res.status(500).json({ error: 'Failed to process RSVP.' });
        }
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

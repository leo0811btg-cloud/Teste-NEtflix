import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import type { SiteData, Guest } from '../types';

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
            const { guestId, attendance } = req.body;

            if (!guestId || !attendance || !['yes', 'no'].includes(attendance)) {
                 return res.status(400).json({ error: 'Invalid RSVP data provided.' });
            }

            const currentData = await kv.get<SiteData>(SITE_DATA_KEY);
            if (!currentData) {
                return res.status(404).json({ error: 'Site data not found. Cannot update RSVP.' });
            }
            
            const guestIndex = currentData.guestList.findIndex(g => g.id === guestId);

            if (guestIndex === -1) {
                return res.status(404).json({ error: 'Guest not found.' });
            }

            currentData.guestList[guestIndex].attendance = attendance;

            await kv.set(SITE_DATA_KEY, currentData);

            return res.status(200).json({ message: 'RSVP updated successfully.' });

        } catch (error) {
            console.error('KV RSVP Error:', error);
            return res.status(500).json({ error: 'Failed to process RSVP.' });
        }
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
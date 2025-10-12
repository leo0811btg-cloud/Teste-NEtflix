import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import type { SiteData, RsvpResponse } from '../types';

const SITE_DATA_KEY = 'siteData';

// Helper function to normalize strings for comparison (case-insensitive, accent-insensitive)
const normalizeString = (str: string) => 
  str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
        return res.status(500).json({ 
            error: 'Configuração do Servidor Incompleta',
            details: 'As variáveis de ambiente para o Vercel KV não foram encontradas. Por favor, conecte um banco de dados KV na aba "Storage" do seu projeto na Vercel.'
        });
    }

    if (req.method === 'POST') {
        try {
            const newRsvp: Omit<RsvpResponse, 'id'> = req.body;
            if (!newRsvp || !newRsvp.name || !newRsvp.attendance) {
                 return res.status(400).json({ error: 'Invalid RSVP data provided.' });
            }

            const normalizedNewName = normalizeString(newRsvp.name);

            // Pega os dados atuais para não sobrescrever outras informações
            const currentData = await kv.get<SiteData>(SITE_DATA_KEY);
            if (!currentData) {
                return res.status(404).json({ error: 'Site data not found. Cannot add RSVP.' });
            }

            // 1. Validação da Lista de Convidados
            const { guestList = [], rsvpResponses = [] } = currentData;
            if (guestList.length > 0) {
                const isGuestOnList = guestList.some(guest => normalizeString(guest) === normalizedNewName);
                if (!isGuestOnList) {
                    return res.status(403).json({ error: 'Este nome não está na lista de convidados.' });
                }
            }
            
            // 2. Validação de Duplicidade
            const hasAlreadyResponded = rsvpResponses.some(response => normalizeString(response.name) === normalizedNewName);
            if (hasAlreadyResponded) {
                return res.status(409).json({ error: 'Este convidado já respondeu.' });
            }
            
            // Adiciona a nova resposta com um ID único
            const fullNewRsvp: RsvpResponse = { ...newRsvp, id: Date.now() };
            const updatedRsvps = [...rsvpResponses, fullNewRsvp];
            
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

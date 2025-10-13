import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import type { SiteData, Guest } from '../types';

const SITE_DATA_KEY = 'siteData';

// Função de sanitização robusta para garantir que a lista de convidados esteja sempre no formato correto.
const sanitizeGuestList = (rawGuestList: any): Guest[] => {
    if (!Array.isArray(rawGuestList)) {
        return [];
    }
    
    return rawGuestList
        .map((guest: any, index: number): Guest | null => {
            // Se o 'guest' for um objeto válido com 'name'
            if (typeof guest === 'object' && guest !== null && typeof guest.name === 'string' && guest.name.trim()) {
                return {
                    id: typeof guest.id === 'number' ? guest.id : Date.now() + index,
                    name: guest.name.trim(),
                    attendance: ['yes', 'no', 'pending'].includes(guest.attendance) ? guest.attendance : 'pending',
                };
            }
            // Se for uma string (de uma versão muito antiga), converte para objeto
            if (typeof guest === 'string' && guest.trim()) {
                return {
                    id: Date.now() + index,
                    name: guest.trim(),
                    attendance: 'pending',
                };
            }
            // Ignora entradas inválidas
            return null;
        })
        .filter((g): g is Guest => g !== null);
};

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
            
            // Limpa a lista de convidados lida do banco de dados ANTES de usá-la.
            const sanitizedGuestList = sanitizeGuestList(currentData.guestList);
            
            const guestIndex = sanitizedGuestList.findIndex(g => g.id === guestId);

            if (guestIndex === -1) {
                return res.status(404).json({ error: 'Guest not found.' });
            }

            // Atualiza a lista já limpa
            sanitizedGuestList[guestIndex].attendance = attendance;
            
            // Cria a versão final dos dados com a lista de convidados corrigida
            const updatedData = { ...currentData, guestList: sanitizedGuestList };

            // Salva os dados atualizados e corrigidos de volta no banco
            await kv.set(SITE_DATA_KEY, updatedData);

            return res.status(200).json({ message: 'RSVP updated successfully.' });

        } catch (error) {
            console.error('KV RSVP Error:', error);
            return res.status(500).json({ error: 'Failed to process RSVP.' });
        }
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const SITE_DATA_KEY = 'siteData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
        return res.status(500).json({ 
            error: 'Configuração do Servidor Incompleta',
            details: 'As variáveis de ambiente para o Vercel KV não foram encontradas. Por favor, conecte um banco de dados KV na aba "Storage" do seu projeto na Vercel.'
        });
    }

    if (req.method === 'GET') {
        try {
            const data = await kv.get(SITE_DATA_KEY);
            if (data === null) {
                // É normal não encontrar dados na primeira vez.
                // O frontend irá inicializar com dados padrão.
                return res.status(404).json({ message: 'No data found.' });
            }
            return res.status(200).json(data);
        } catch (error) {
            console.error('KV GET Error:', error);
            return res.status(500).json({ error: 'Failed to fetch data from KV store.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const newData = req.body;
            if (!newData) {
                return res.status(400).json({ error: 'No data provided in request body.' });
            }
            await kv.set(SITE_DATA_KEY, newData);
            return res.status(200).json({ message: 'Data saved successfully.' });
        } catch (error) {
            console.error('KV SET Error:', error);
            return res.status(500).json({ error: 'Failed to save data to KV store.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

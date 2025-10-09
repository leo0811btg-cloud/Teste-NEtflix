import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { DEFAULT_SITE_DATA } from '../constants';
import type { SiteData } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
  return res.status(405).end(`Método ${req.method} não permitido.`);
}
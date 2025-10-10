import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Diz à Vercel para não processar o corpo da requisição, 
// pois precisamos do fluxo de dados brutos para o upload.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verifica se a chave de API do Vercel Blob está configurada
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ 
        error: 'Configuração do Servidor Incompleta',
        details: 'A variável de ambiente para o Vercel Blob não foi encontrada. Por favor, conecte um armazenamento Blob na aba "Storage" do seu projeto na Vercel.'
    });
  }

  const filename = req.query.filename as string;
  if (!filename || !req.body) {
    return res.status(400).json({ error: 'Nome do arquivo e corpo da requisição são obrigatórios.' });
  }

  try {
    // Faz o upload do arquivo (req.body é um stream) para o Vercel Blob.
    // 'access: public' torna o arquivo acessível publicamente pela URL.
    const blob = await put(filename, req.body, {
      access: 'public',
    });

    // Retorna os detalhes do blob, incluindo a URL pública.
    return res.status(200).json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return res.status(500).json({ error: 'Falha ao enviar imagem.' });
  }
}
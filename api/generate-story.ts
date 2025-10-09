// Importa os tipos necessários para as Funções da Vercel
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

// A chave de API é lida de uma variável de ambiente no servidor
const apiKey = process.env.API_KEY;

if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

// Esta é a função que a Vercel irá executar
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Apenas permite requisições do tipo POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { keywords, genre } = req.body;

    if (!keywords || !genre) {
        return res.status(400).json({ error: 'Keywords and genre are required.' });
    }

    const prompt = `Escreva uma sinopse de filme no estilo de um(a) ${genre} para o casal Maria e João. A história deles envolve os seguintes elementos: ${keywords}. A sinopse deve ser curta, criativa e cativante, como se fosse para a Netflix. Termine com uma frase de efeito.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.8,
            maxOutputTokens: 250,
            thinkingConfig: { thinkingBudget: 125 },
        }
    });

    // Retorna a história gerada com sucesso
    return res.status(200).json({ story: response.text });

  } catch (error) {
    console.error("Error in generate-story API route:", error);
    return res.status(500).json({ error: "Failed to generate story." });
  }
}
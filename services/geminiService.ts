
export const generateStory = async (keywords: string, genre: string): Promise<string> => {
    try {
        // Faz uma requisição para a nossa API Route segura
        const response = await fetch('/api/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keywords, genre }),
        });

        if (!response.ok) {
            // Se a resposta não for OK, lança um erro
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch story from API route.');
        }

        const data = await response.json();
        return data.story;

    } catch (error) {
        console.error("Error generating story via API route:", error);
        return "Desculpe, nosso roteirista de IA está com bloqueio criativo. Tente novamente mais tarde!";
    }
};

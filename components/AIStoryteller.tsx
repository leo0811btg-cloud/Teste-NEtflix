
import React, { useState, useCallback } from 'react';
import { generateStory } from '../services/geminiService';

export const AIStoryteller: React.FC = () => {
    const [keywords, setKeywords] = useState('cafeteria, dança, viagem');
    const [genre, setGenre] = useState('Comédia Romântica');
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateStory = useCallback(async () => {
        if (!keywords || !genre) return;
        setIsLoading(true);
        setStory('');
        try {
            const result = await generateStory(keywords, genre);
            setStory(result);
        } catch (error) {
            console.error(error);
            setStory('Ocorreu um erro ao gerar a história. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [keywords, genre]);


    return (
        <div className="flex-shrink-0 w-[95%] md:w-[60%] mr-4 bg-zinc-800 rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-zinc-400 mb-2">Palavras-chave (separadas por vírgula)</label>
                        <input
                            type="text"
                            id="keywords"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="w-full bg-zinc-700 border-zinc-600 text-white rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Ex: praia, sorvete, cinema"
                        />
                    </div>
                    <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-zinc-400 mb-2">Gênero do Filme</label>
                        <select
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full bg-zinc-700 border-zinc-600 text-white rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option>Comédia Romântica</option>
                            <option>Aventura</option>
                            <option>Drama</option>
                            <option>Mistério</option>
                            <option>Ficção Científica</option>
                        </select>
                    </div>
                    <button
                        onClick={handleGenerateStory}
                        disabled={isLoading}
                        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300 disabled:bg-zinc-600 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Gerar Sinopse'}
                    </button>
                </div>
                <div className="flex-1 bg-zinc-900 p-4 rounded-md min-h-[150px] text-zinc-300">
                    <h4 className="font-bold mb-2 text-white">Sua História Gerada:</h4>
                    {isLoading ? <p>Nossos roteiristas estão trabalhando...</p> : <p className="text-sm whitespace-pre-wrap">{story || 'Clique em "Gerar Sinopse" para criar uma história para o casal.'}</p>}
                </div>
            </div>
        </div>
    );
};

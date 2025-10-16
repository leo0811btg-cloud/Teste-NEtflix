import React, { useEffect, useRef, useState } from 'react';
import type { Gift, PixConfig } from '../types';

declare const QRious: any;

// Calcula o CRC16-CCITT-FALSE, necessário para o payload do PIX
const crc16 = (data: string): string => {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
};

// Formata um campo específico para o padrão EMV (BR Code)
const formatField = (id: string, value: string): string => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
};

// Gera o payload completo do PIX
const generatePixPayload = (key: string, recipientName: string, city: string, amount: number, txid: string): string => {
    // Normaliza nome e cidade para o padrão PIX (remove acentos, limita tamanho)
    const normalizedName = recipientName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25);
    const normalizedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().substring(0, 15);

    const payload = [
        formatField('00', '01'), // Payload Format Indicator
        formatField('26', 
            formatField('00', 'br.gov.bcb.pix') +
            formatField('01', key)
        ),
        formatField('52', '0000'), // Merchant Category Code
        formatField('53', '986'), // Transaction Currency (BRL)
        formatField('54', amount.toFixed(2)), // Transaction Amount
        formatField('58', 'BR'), // Country Code
        formatField('59', normalizedName), // Recipient Name
        formatField('60', normalizedCity), // Recipient City
        formatField('62', formatField('05', txid)) // Transaction ID
    ].join('');

    const payloadWithCrc = payload + "6304";
    const crcResult = crc16(payloadWithCrc);
    
    return payloadWithCrc + crcResult;
};

interface GiftModalProps {
  gift: Gift;
  pixConfig: PixConfig;
  onClose: () => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ gift, pixConfig, onClose }) => {
    const qrCodeRef = useRef<HTMLCanvasElement>(null);
    const [pixCopiaECola, setPixCopiaECola] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (gift && pixConfig.key) {
            // Padroniza o TXID para '***', que é a prática recomendada para QR Codes estáticos
            // onde um ID de transação único não é necessário para a reconciliação do recebedor.
            // Isso resolve o problema de IDs inválidos para novos presentes.
            const txid = '***';
            const payload = generatePixPayload(
                pixConfig.key,
                pixConfig.recipientName,
                pixConfig.city,
                gift.price,
                txid
            );
            setPixCopiaECola(payload);

            if (qrCodeRef.current && typeof QRious !== 'undefined') {
                new QRious({
                    element: qrCodeRef.current,
                    value: payload,
                    size: 256,
                    background: 'white',
                    foreground: '#18181b',
                    level: 'H'
                });
            }
        }
    }, [gift, pixConfig]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(pixCopiaECola);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-md mx-auto p-6 md:p-8 relative text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="font-bebas text-3xl text-red-600 mb-2">Muito obrigado pelo presente!</h3>
        <p className="text-zinc-300 mb-4">Você está presenteando: <strong className="text-white">{gift.name}</strong></p>
        <p className="font-bold text-2xl mb-6">{gift.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>

        <div className="bg-white p-4 rounded-lg inline-block">
            <canvas ref={qrCodeRef}></canvas>
        </div>

        <p className="text-zinc-400 text-sm mt-6 mb-2">Se preferir, use o PIX Copia e Cola:</p>

        <div className="bg-zinc-800 p-2 rounded-lg flex items-center gap-2">
            <input 
                type="text" 
                readOnly 
                value={pixCopiaECola} 
                className="bg-transparent text-zinc-300 text-xs w-full focus:outline-none"
                aria-label="Código PIX Copia e Cola"
            />
            <button 
                onClick={handleCopy}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300 text-sm flex-shrink-0"
            >
                {copied ? 'Copiado!' : 'Copiar'}
            </button>
        </div>

        <p className="text-xs text-zinc-500 mt-6">Após a transferência, sinta-se à vontade para nos avisar! Agradecemos imensamente o seu carinho.</p>
      </div>
    </div>
  );
};

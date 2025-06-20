import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { sectors } from '../../data/sectors';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim().toLowerCase();
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');

    // Process the message and generate response
    let response = '';

    // Check for general agriculture questions
    if (userMessage.includes('yield gap')) {
      response = 'O yield gap representa a diferença entre o rendimento potencial de uma cultura e o rendimento real obtido pelos agricultores. No Brasil, dependendo do setor e região, esse gap pode variar de 20% a 60%. Principais fatores incluem: manejo inadequado, limitações tecnológicas, pragas e doenças, e variabilidade climática.';
    }
    else if (userMessage.includes('agro') || userMessage.includes('agricultura')) {
      response = 'O agronegócio brasileiro é um dos mais importantes do mundo, representando cerca de 25% do PIB nacional. O Brasil é líder em produção e exportação de diversos produtos agrícolas, com destaque para soja, café, cana-de-açúcar, milho e carnes.';
    }
    else {
      // Check for sector-specific questions
      const matchedSector = sectors.find(sector => 
        userMessage.includes(sector.id) || 
        userMessage.includes(sector.name.toLowerCase())
      );

      if (matchedSector) {
        response = `${matchedSector.name}:\n\n` +
          `${matchedSector.description}\n\n` +
          `Produção Global: ${matchedSector.statistics.globalOutput}\n` +
          `Principais Regiões: ${matchedSector.statistics.mainRegions.join(', ')}\n` +
          `Crescimento Anual: ${matchedSector.statistics.annualGrowth}\n\n` +
          `Preço Atual: ${matchedSector.marketInfo.currentPrice}\n` +
          `Tendência: ${matchedSector.marketInfo.trend === 'up' ? '↑ Em alta' : matchedSector.marketInfo.trend === 'down' ? '↓ Em baixa' : '→ Estável'}`;
      } else {
        response = 'Olá! Posso ajudar com informações sobre:\n\n' +
          '- Yield gap na agricultura\n' +
          '- Panorama do agronegócio brasileiro\n' +
          '- Setores específicos como:\n' +
          sectors.map(s => `  • ${s.name}`).join('\n') + '\n\n' +
          'Como posso ajudar?';
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 bg-green-700 text-white p-4 rounded-full shadow-lg hover:bg-green-800 transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="p-4 bg-green-700 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Assistente AgriInsights</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua pergunta..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSend}
                className="bg-green-700 text-white p-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
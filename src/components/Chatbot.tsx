import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a helpful customer service chatbot for "Combatiac Ventures", a stationery and general merchant company based in Ghana.
Be polite, professional, and concise.

Company Information:
- Name: Combatiac Ventures
- Founded: July 6th, 2020
- Manager: Issah Awal
- Location: Rhema street, Lebanon zone 4 Ashaiman. Hse No z4/B149. GPS Address GB.050-3461. Greater Accra, Ghana.
- Postal Address: P.o.box As 564 Ashaiman
- Phone Numbers: 0246037971 / 0273580479
- Emails: issahawal3@gmail.com / combatiacventures@gmail.com
- Products: General Merchant, office products, papers, box files, pens, pencils, staplers, printers, shredders, paperclips, stationery cabinets, ink, cartridges.
- Services & Sales Conditions:
  1. Free delivery within 24 hours of approved orders (immediate delivery in case of emergency).
  2. Credit facilities up to two weeks for payment (or different limit period as agreed).
  3. Orders can be placed by email or phone. We issue a proforma invoice. Once approved and a local purchase order (LPO) is issued, we deliver within 24 hours.
  4. We keep records of products bought for easy re-ordering.
  5. Prices are very competitive with good item qualities.

If a user asks to buy something, tell them to contact via phone or email to get a proforma invoice.
`;

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! Welcome to Combatiac Ventures. How can I help you with your office supplies today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  useEffect(() => {
    // Initialize chat session
    const chat = ai.chats.create({
      model: 'gemini-3.1-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    setChatSession(chat);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !chatSession) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', content: response.text || 'Sorry, I could not process that.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again later or contact us directly.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-700 transition-transform hover:scale-105 z-50 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open Chat"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold">Combatiac Support</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-emerald-100 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-sm' 
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-sm shadow-sm'
                  }`}>
                    <div className="prose prose-sm max-w-none prose-p:leading-snug prose-p:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <Loader2 size={16} className="animate-spin text-emerald-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-stone-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-full outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

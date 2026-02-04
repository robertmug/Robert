
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

const AIAgentView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          thinkingConfig: { thinkingBudget: 4000 },
          systemInstruction: "You are the AI Digital Twin of MUGISHA ROBERT, a brilliant Level 5 Software Development student at GSNDP CYANIKA. Your purpose is to represent Robert to potential employers, recruiters, and collaborators. You speak with a professional, confident, and innovative tone. You know Robert's skills (Java, Python, Web Dev, SQL) and his dedication to software excellence. If asked personal questions, answer as Robert's representative. Emphasize his education at GSNDP CYANIKA."
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry, Robert's server is busy. Try again soon!",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Agent error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Robert's Digital Twin</h3>
            <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">AI Representative</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all"
        >
          Reset Session
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <h4 className="text-3xl font-black text-white mb-4">"Ask me anything about Robert's career."</h4>
            <p className="text-slate-500 mb-8 leading-relaxed">
              I can explain his technical background, school projects at GSNDP CYANIKA, and his future software aspirations.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              {["What did Robert study at GSNDP CYANIKA?", "Show me Robert's coding skills.", "How can I contact Robert?"].map(q => (
                <button 
                   key={q}
                   onClick={() => { setInput(q); }}
                   className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm hover:border-indigo-500/50 transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] md:max-w-[65%] rounded-[2rem] px-6 py-4 shadow-xl ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] px-6 py-4 rounded-tl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-10 bg-slate-950">
        <div className="max-w-4xl mx-auto flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Robert's Digital Twin..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-[2rem] px-8 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none max-h-40 transition-all shadow-inner"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-full transition-all shadow-2xl shadow-indigo-500/40"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAgentView;

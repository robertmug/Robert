
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GeneratedImage } from '../types';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const generateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        // Iterate through all parts to find the image part
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        const newImg: GeneratedImage = {
          id: Date.now().toString(),
          url: imageUrl,
          prompt: prompt,
          timestamp: new Date()
        };
        setHistory(prev => [newImg, ...prev]);
        setSelectedImage(newImg);
        setPrompt('');
      }
    } catch (error) {
      console.error("Image generation error:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-950 overflow-hidden">
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">Visual Studio</h2>
          <p className="text-gray-500">Gemini 2.5 Flash Image • High Fidelity Generation</p>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          {selectedImage ? (
            <div className="relative group max-w-2xl w-full">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.prompt} 
                className="w-full h-auto rounded-2xl shadow-2xl border border-gray-800"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 rounded-2xl">
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedImage.url;
                    link.download = `nexus-${selectedImage.id}.png`;
                    link.click();
                  }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md"
                  title="Download"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
              <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                <p className="text-sm text-gray-400 font-medium italic">"{selectedImage.prompt}"</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center text-gray-700 mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-400">Your canvas awaits</h3>
              <p className="text-gray-600 mt-2 max-w-sm">Enter a prompt below to generate stunning visuals with Nexus AI.</p>
            </div>
          )}
        </div>

        <div className="mt-8 max-w-3xl mx-auto w-full">
          <div className="relative group">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
              placeholder="A futuristic cybernetic garden at midnight, digital art style..."
              className="w-full bg-gray-900/80 border border-gray-800 text-gray-100 rounded-2xl pl-6 pr-32 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition-all placeholder:text-gray-600"
            />
            <button
              onClick={generateImage}
              disabled={!prompt.trim() || isGenerating}
              className="absolute right-3 top-3 bottom-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Generate</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">History</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-sm">
              No generations yet
            </div>
          ) : (
            history.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`w-full group relative rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage?.id === img.id ? 'border-blue-500 scale-[1.02]' : 'border-transparent hover:border-gray-700'
                }`}
              >
                <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">View</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageView;

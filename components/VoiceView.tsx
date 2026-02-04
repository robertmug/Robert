
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decode, decodeAudioData, createPcmBlob } from '../utils/audio';

const VoiceView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) audioContextRef.current.close();
    if (outAudioContextRef.current) outAudioContextRef.current.close();
    setIsActive(false);
    setStatus('idle');
  }, []);

  const startSession = async () => {
    setStatus('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const inCtx = new AudioContext({ sampleRate: 16000 });
      const outCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = inCtx;
      outAudioContextRef.current = outCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            const source = inCtx.createMediaStreamSource(stream);
            const processor = inCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const base64Pcm = createPcmBlob(inputData);
              // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64Pcm, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(processor);
            processor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('speaking');
              const bytes = decode(base64Audio);
              const buffer = await decodeAudioData(bytes, outCtx, 24000, 1);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e) => console.error(e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are Robert\'s interactive voice assistant. Greet users warmly and offer to tell them about Robert\'s projects or his education at GSNDP CYANIKA in Level 5 Software Development. Speak clearly and concisely.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Interactive Voice Profile</h2>
        <p className="text-slate-400 mb-12 text-lg">
          Connect with my voice assistant to have a real-time conversation about my background as a developer.
        </p>

        <div className="relative mb-16 inline-block">
          <div className={`w-64 h-64 rounded-full border-[10px] border-indigo-600/10 flex items-center justify-center transition-all duration-700 ${isActive ? 'scale-110' : 'scale-100'}`}>
             <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-2xl flex items-center justify-center ${isActive ? 'animate-pulse' : ''}`}>
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
             </div>
             {isActive && (
               <div className="absolute inset-0 border-2 border-indigo-400 rounded-full animate-ping opacity-20"></div>
             )}
          </div>
          <div className="mt-8 text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs">
            {status}
          </div>
        </div>

        <div>
          <button
            onClick={isActive ? stopSession : startSession}
            className={`px-12 py-5 rounded-[2rem] font-black text-xl transition-all shadow-2xl ${
              isActive 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
            }`}
          >
            {isActive ? 'Disconnect' : 'Start Conversation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceView;

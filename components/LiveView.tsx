
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decode, decodeAudioData, createPcmBlob } from '../utils/audio';

const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{role: string, text: string}[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outAudioContextRef.current) {
      outAudioContextRef.current.close();
      outAudioContextRef.current = null;
    }
    setIsActive(false);
    setStatus('idle');
    setTranscriptions([]);
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
            console.log('Live session opened');
            setStatus('listening');
            setIsActive(true);

            // Setup input streaming
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
            // Audio output processing
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

            // Interrupt logic
            if (message.serverContent?.interrupted) {
              for (const s of sourcesRef.current.values()) {
                s.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }

            // Transcription handling
            if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            }
            if (message.serverContent?.turnComplete) {
              const uText = currentInputTranscription.current;
              const aText = currentOutputTranscription.current;
              setTranscriptions(prev => [...prev, {role: 'user', text: uText}, {role: 'assistant', text: aText}]);
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
            }
          },
          onerror: (e) => console.error('Live error:', e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are a helpful and friendly AI assistant from Nexus AI. Keep responses conversational and concise.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start live session:', err);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 items-center justify-center p-6">
      <div className="max-w-xl w-full flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center relative">
          
          {/* Audio Visualizer Mock */}
          <div className="relative mb-12">
            <div className={`w-48 h-48 rounded-full border-4 border-blue-500/20 flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <div className={`w-40 h-40 rounded-full border-4 border-blue-500/40 flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110 rotate-180' : 'scale-100 rotate-0'}`}>
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/40 flex items-center justify-center transition-transform ${isActive ? 'animate-pulse' : ''}`}>
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </div>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-blue-400 whitespace-nowrap">
              {status}
            </div>
          </div>

          {/* Transcriptions */}
          <div className="w-full bg-gray-900/50 rounded-2xl border border-gray-800 p-6 flex-1 overflow-y-auto mb-8 max-h-[300px]">
            {transcriptions.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                Start a session to see transcriptions...
              </div>
            ) : (
              <div className="space-y-4">
                {transcriptions.map((t, i) => (
                  <div key={i} className={`flex flex-col ${t.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-gray-600 uppercase mb-1">{t.role}</span>
                    <p className={`text-sm px-4 py-2 rounded-xl ${t.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                      {t.text || "..."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pb-8">
          <button
            onClick={isActive ? stopSession : startSession}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center space-x-3 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/20' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
            }`}
          >
            {status === 'connecting' ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isActive ? 'End Conversation' : 'Start Live Session'}</span>
                {isActive ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                )}
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-gray-600 mt-6 uppercase tracking-[0.2em]">
            Requires microphone permission • Real-time processing via Gemini Live API
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveView;

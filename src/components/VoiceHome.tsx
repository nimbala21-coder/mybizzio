
import React, { useState, useRef, useEffect } from 'react';
import { IconMic, IconStop, IconArrowLeft, IconTrendingUp, IconTrendingDown, IconInstagram } from './Icons';
import { ViewState } from '../types';

interface VoiceHomeProps {
  onInputCaptured: (text: string, isAudio: boolean, mimeType?: string) => void;
  setView: (view: ViewState) => void;
}

const VoiceHome: React.FC<VoiceHomeProps> = ({ onInputCaptured, setView }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [activePlatform, setActivePlatform] = useState<'All' | 'Insta' | 'TikTok' | 'FB'>('All');
  
  // MediaRecorder Refs (Legacy/Fallback)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Speech Recognition Refs (Primary)
  const recognitionRef = useRef<any>(null);
  const [usingSpeechApi, setUsingSpeechApi] = useState(false);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  // 1. Attempt Browser Native Speech Recognition (Fail-safe for Demos)
  const startSpeechRecognition = (): boolean => {
    // Check if browser supports Speech Recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return false;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false; // Stop after one sentence
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setUsingSpeechApi(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Speech Recognized:", transcript);
      // CRITICAL: We send this as TEXT (isAudio: false)
      // This bypasses the fragile audio file upload and guarantees keywords are found.
      onInputCaptured(transcript, false); 
      setIsProcessing(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech API Error", event.error);
      // If speech API fails, stop recording UI
      setIsRecording(false);
      setIsProcessing(false);
      
      // Only alert if it's a genuine error, not just 'no-speech' which happens if user is silent
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn("Speech recognition failed, user might need to type or check permissions.");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      setUsingSpeechApi(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    return true;
  };

  // 2. Fallback to MediaRecorder (If Speech API missing)
  const startMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Let browser pick default mimeType for best compatibility
      const recorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Capture the actual mimeType the browser used
        const finalMimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: finalMimeType });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
           if (reader.result) {
              const base64String = (reader.result as string).split(',')[1];
              // Fallback flow - sends isAudio: true
              onInputCaptured(base64String, true, finalMimeType);
           }
           // CRITICAL FIX: Always reset processing state, even if result is null
           setIsProcessing(false);
        };
        reader.onerror = () => {
          console.error("FileReader error");
          setIsProcessing(false);
          alert("Audio processing failed. Please try typing instead.");
        };
        cleanup();
      };

      recorder.start();
      setIsRecording(true);
      setUsingSpeechApi(false);
    } catch (err) {
      console.error("Mic Error", err);
      alert("Unable to access microphone.");
      setIsProcessing(false);
    }
  };

  const startRecording = () => {
    if (isRecording || isProcessing) return;
    setIsProcessing(true);

    // TRY SPEECH API FIRST (Best for Demo Stability)
    // This turns voice into Text immediately on the client.
    const speechStarted = startSpeechRecognition();
    if (!speechStarted) {
      // Fallback to raw audio recording if browser doesn't support Speech API
      startMediaRecorder();
    }
  };

  const stopRecording = () => {
    // Force UI update
    setIsRecording(false);
    
    if (usingSpeechApi && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      cleanup();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onInputCaptured(textInput, false);
    }
  };

  // Dynamic Stats Data with Trend Indicator
  const stats: any = {
    'All': { reach: '24.5k', engage: '3.2k', clicks: '840', rTrend: 'up', eTrend: 'up', cTrend: 'down' },
    'Insta': { reach: '12.1k', engage: '2.1k', clicks: '510', rTrend: 'up', eTrend: 'up', cTrend: 'up' },
    'TikTok': { reach: '8.4k', engage: '900', clicks: '210', rTrend: 'down', eTrend: 'up', cTrend: 'down' },
    'FB': { reach: '4.0k', engage: '200', clicks: '120', rTrend: 'down', eTrend: 'down', cTrend: 'down' },
  };
  const currentStats = stats[activePlatform];

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' }) => (
    trend === 'up' 
      ? <IconTrendingUp className="w-3 h-3 text-emerald-500 inline ml-1" />
      : <IconTrendingDown className="w-3 h-3 text-red-400 inline ml-1" />
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-y-auto pb-24">
      
      {/* Header / Hero Section */}
      <div className="bg-gradient-to-b from-brand-purple to-purple-800 relative flex flex-col items-center px-6 pt-12 pb-16 rounded-b-[2.5rem] shadow-xl z-10">
        
        {/* Nav Row */}
        <div className="w-full flex justify-between items-center mb-20">
           <div className="flex items-center gap-2">
              <span className="text-white text-2xl font-extrabold tracking-tighter">bizzio</span>
              <div className="w-2 h-2 rounded-full bg-brand-orange mt-1 animate-pulse"></div>
           </div>
           <button onClick={() => setView(ViewState.PROFILE)} className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm active:bg-white/20 transition-all">J</button>
        </div>

        {/* Creation Zone */}
        <div className="w-full max-w-md flex flex-col items-center">
          <h2 className="text-white font-bold text-2xl mb-8 text-center leading-tight tracking-tight">What's happening today?</h2>
          
          <div className="relative mb-8">
            <button
              onClick={toggleRecording}
              disabled={isProcessing && !isRecording}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 border-4 border-white/20 z-20 touch-manipulation
                ${isRecording ? 'bg-red-500 scale-100' : 'bg-brand-orange hover:bg-orange-400 active:scale-95'}
                ${(isProcessing && !isRecording) ? 'opacity-80' : ''}
              `}
            >
              {(isProcessing && !isRecording) ? (
                 <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isRecording ? (
                 <IconStop className="w-8 h-8 text-white" />
              ) : (
                 <IconMic className="w-10 h-10 text-white" />
              )}
            </button>
             {isRecording && (
               <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping-slow pointer-events-none z-0"></div>
             )}
          </div>

          {/* Input Field */}
          <form onSubmit={handleTextSubmit} className="w-full relative z-20">
            <input 
                type="text" 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Describe your next big idea..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-3.5 pl-6 pr-12 text-white placeholder-purple-200 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 transition-all text-sm shadow-inner backdrop-blur-sm"
            />
            {textInput.trim() && (
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-brand-orange rounded-full w-9 flex items-center justify-center text-white shadow-sm">
                <IconArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="px-6 mt-6 animate-slide-up relative z-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weekly Pulse</h3>
              <div className="flex gap-1 bg-slate-50 p-0.5 rounded-lg">
                {['All', 'Insta', 'TikTok', 'FB'].map((p: any) => (
                  <button 
                    key={p} 
                    onClick={() => setActivePlatform(p)} 
                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${activePlatform === p ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
           </div>
           
           <div className="flex items-center justify-between divide-x divide-slate-50">
              <div className="flex-1 text-center px-1">
                <p className="text-lg font-black text-slate-800 tracking-tight flex items-center justify-center">
                  {currentStats.reach} <TrendIcon trend={currentStats.rTrend} />
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Reach</p>
              </div>
              <div className="flex-1 text-center px-1">
                <p className="text-lg font-black text-slate-800 tracking-tight flex items-center justify-center">
                  {currentStats.engage} <TrendIcon trend={currentStats.eTrend} />
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Engage</p>
              </div>
              <div className="flex-1 text-center px-1">
                <p className="text-lg font-black text-slate-800 tracking-tight flex items-center justify-center">
                  {currentStats.clicks} <TrendIcon trend={currentStats.cTrend} />
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Clicks</p>
              </div>
           </div>
        </div>
      </div>

      {/* Latest Activity Snapshot */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-baseline mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Activity</h3>
          <button onClick={() => setView(ViewState.MANAGE)} className="text-[10px] font-bold text-brand-purple hover:text-purple-700">
            View History
          </button>
        </div>
        
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.99] transition-transform cursor-pointer" onClick={() => setView(ViewState.MANAGE)}>
           <div className="h-12 w-12 rounded-xl bg-slate-100 relative flex-shrink-0 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=60" alt="Latest" className="w-full h-full object-cover" />
             <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm p-0.5 rounded-tl-lg">
               <IconInstagram className="w-3 h-3 text-pink-500" />
             </div>
           </div>
           <div className="flex-1 min-w-0">
             <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-slate-900 truncate pr-2">Summer Sale Promo</h4>
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded flex-shrink-0">Posted</span>
             </div>
             <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago</p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default VoiceHome;


import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VoiceHome from './components/VoiceHome';
import Manage from './components/Manage';
import AdManager from './components/AdManager';
import Processing from './components/Processing';
import FormatPicker from './components/FormatPicker';
import Mixer from './components/Mixer';
import Profile from './components/Profile';
import GuidedCreation from './components/GuidedCreation';
import FeedPreview from './components/FeedPreview';
import { ViewState, MixerData, FeedPreviewData, DesignState } from './types';
import { IconCheck } from './components/Icons';
import { generatePostIngredients, generateCaptionsFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [tempInput, setTempInput] = useState<{text: string, isAudio: boolean, mimeType?: string} | null>(null);
  const [mixerData, setMixerData] = useState<MixerData | null>(null);
  const [previewData, setPreviewData] = useState<FeedPreviewData | null>(null);
  const [savedDesignState, setSavedDesignState] = useState<DesignState | null>(null);

  // Step 1: Input Captured from Home (Updated to accept mimeType)
  const handleInputCaptured = (text: string, isAudio: boolean, mimeType?: string) => {
    setTempInput({ text, isAudio, mimeType });
    setView(ViewState.FORMAT_PICKER);
  };

  // UNIFIED FLOW
  const runMixerFlow = async (text: string, isAudio: boolean, format: 'Post' | 'Reel' | 'Story', mimeType?: string) => {
    setSavedDesignState(null);
    
    setMixerData({
        intent: 'Drafting content...',
        format: format,
        visuals: [], 
        captions: [],
        isLoading: true
    });
    
    setView(ViewState.MIXER);

    try {
        const data = await generatePostIngredients(text, isAudio, format, mimeType);
        setMixerData(data);
    } catch (e) {
        console.error("Background generation failed", e);
    }
  };

  // NEW: PHOTO-FIRST FLOW (Optimistic UI)
  const handlePhotoInput = async (image: string, format: 'Post' | 'Reel' | 'Story') => {
    setSavedDesignState(null);
    
    // 1. Show Mixer IMMEDIATELY with the user's photo
    setMixerData({
        intent: 'Analyzing image...',
        format: format,
        visuals: [{ id: 'user-upload', prompt: 'User Photo', url: image }], // Visual available immediately
        captions: [], // Captions loading
        isLoading: true // Signals that we are still fetching data (captions)
    });
    
    setView(ViewState.MIXER);

    // 2. Fetch Captions in Background using Vision
    try {
        const data = await generateCaptionsFromImage(image, format);
        setMixerData(data); // Updates with captions when ready
    } catch (e) {
        console.error("Vision generation failed", e);
    }
  };

  // Step 2: Format Selected (from Voice Flow)
  const handleFormatSelected = async (format: 'Post' | 'Reel') => {
    if (!tempInput) return;
    runMixerFlow(tempInput.text, tempInput.isAudio, format, tempInput.mimeType);
  };

  // Step 2b: Manual Creation (from Guided Flow)
  const handleGuidedSubmit = (text: string, format: 'Post' | 'Reel' | 'Story') => {
    runMixerFlow(text, false, format);
  };

  const handleMixerNext = (data: FeedPreviewData) => {
    setSavedDesignState(data.design);
    setPreviewData(data);
    setView(ViewState.PREVIEW_FEED);
  };

  const handlePostComplete = () => {
    setView(ViewState.SUCCESS);
    setTimeout(() => {
      setView(ViewState.HOME);
      setMixerData(null);
      setTempInput(null);
      setPreviewData(null);
      setSavedDesignState(null);
    }, 2000);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.PROCESSING:
        return <Processing />;
      
      case ViewState.FORMAT_PICKER:
        return (
          <>
            <VoiceHome onInputCaptured={() => {}} setView={setView} />
            <FormatPicker 
              onSelect={handleFormatSelected} 
              onCancel={() => setView(ViewState.HOME)} 
            />
          </>
        );

      case ViewState.MIXER:
        return mixerData ? (
          <Mixer 
            data={mixerData} 
            initialDesign={savedDesignState} 
            onBack={() => setView(ViewState.HOME)} 
            onNext={handleMixerNext}
          />
        ) : null;

      case ViewState.PREVIEW_FEED:
        return previewData ? (
            <FeedPreview 
                data={previewData}
                onBack={() => setView(ViewState.MIXER)}
                onPublish={handlePostComplete}
            />
        ) : null;

      case ViewState.SUCCESS:
        return (
          <div className="flex flex-col h-full items-center justify-center bg-green-500 text-white p-8 text-center animate-fade-in">
             <div className="bg-white text-green-500 p-6 rounded-full mb-6 shadow-xl animate-scale-in">
               <IconCheck className="w-12 h-12" />
             </div>
             <h2 className="text-3xl font-bold mb-2">Success!</h2>
             <p className="opacity-90">Content scheduled successfully.</p>
          </div>
        );

      case ViewState.MANAGE:
        return <Manage />;
      case ViewState.ADS:
        return <AdManager />;
      case ViewState.PROFILE:
        return <Profile onBack={() => setView(ViewState.HOME)} />;
      case ViewState.GUIDED_CREATION:
        return <GuidedCreation onSubmit={handleGuidedSubmit} onPhotoSubmit={handlePhotoInput} setView={setView} />;
      
      case ViewState.HOME:
      default:
        return <VoiceHome onInputCaptured={handleInputCaptured} setView={setView} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-50 overflow-hidden flex flex-col">
      <main className="flex-1 overflow-y-auto relative no-scrollbar">
        {renderContent()}
      </main>
      <Navbar currentView={view} setView={setView} />
    </div>
  );
};

export default App;

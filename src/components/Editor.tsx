import React, { useState, useRef, useEffect } from 'react';
import { SocialPostTemplate } from '../types';
import { IconArrowLeft, IconCamera, IconImage, IconCheck, IconInstagram, IconFacebook, IconTikTok, IconSparkles } from './Icons';

interface EditorProps {
  template: SocialPostTemplate;
  onBack: () => void;
  onComplete: () => void;
}

const Editor: React.FC<EditorProps> = ({ template, onBack, onComplete }) => {
  const [text, setText] = useState(template.body);
  const [headline, setHeadline] = useState(template.headline);
  const [imageSrc, setImageSrc] = useState(`https://source.unsplash.com/random/800x800/?${encodeURIComponent(template.suggestedImageQuery)}`);
  const [isPosting, setIsPosting] = useState(false);
  const [postingStep, setPostingStep] = useState(0);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
     const query = encodeURIComponent(template.suggestedImageQuery);
     setImageSrc(`https://loremflickr.com/800/800/${query}/all`);
  }, [template.suggestedImageQuery]);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImageSrc(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (useCamera: boolean) => {
    if (fileInputRef.current) {
      if (useCamera) {
        fileInputRef.current.setAttribute('capture', 'environment');
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };

  const handleAiImageGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingImage(true);
    setShowAiPrompt(false);

    // Simulate AI Generation
    setTimeout(() => {
      const query = encodeURIComponent(aiPrompt);
      // Use a different source or append randomness to force reload
      setImageSrc(`https://loremflickr.com/800/800/${query}/all?random=${Math.random()}`);
      setIsGeneratingImage(false);
      setAiPrompt('');
    }, 2000);
  };

  const handlePostClick = () => {
    setIsPosting(true);
    setPostingStep(1);
    setTimeout(() => setPostingStep(2), 1500); 
    setTimeout(() => {
        setPostingStep(3); 
        setTimeout(() => {
            onComplete();
        }, 1200);
    }, 3500);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Posting Overlay */}
      {isPosting && (
        <div className="absolute inset-0 bg-brand-purple/95 z-50 flex flex-col items-center justify-center p-8 text-white backdrop-blur-sm animate-fade-in">
           <div className="w-20 h-20 mb-8 relative flex items-center justify-center">
              {postingStep < 3 && (
                <>
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-brand-orange border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </>
              )}
              {postingStep === 3 && (
                <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center animate-scale-in shadow-lg shadow-green-500/50">
                    <IconCheck className="w-10 h-10 text-white" />
                </div>
              )}
           </div>
           <h3 className="text-2xl font-bold mb-2 text-center animate-slide-up">
               {postingStep === 1 && `Connecting to ${template.platform}...`}
               {postingStep === 2 && "Uploading Media..."}
               {postingStep === 3 && "Published!"}
           </h3>
           <p className="text-purple-200 text-sm animate-pulse">Do not close the app</p>
        </div>
      )}

      {/* AI Prompt Modal */}
      {showAiPrompt && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Generate with AI</h3>
            <form onSubmit={handleAiImageGenerate}>
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the image (e.g. 'Gold glitter nails with blurred background')..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-purple mb-4 h-24 resize-none"
                autoFocus
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAiPrompt(false)} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={!aiPrompt.trim()} className="flex-1 py-2 text-sm font-bold bg-brand-purple text-white rounded-lg shadow-lg shadow-purple-200">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 bg-white z-20">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preview</h1>
        <button 
          onClick={handlePostClick}
          className="bg-brand-purple text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-purple-800 transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center gap-2"
        >
          <span>Post</span>
          <IconCheck className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Image Preview / Edit */}
        <div className="relative w-full aspect-square bg-slate-100 group overflow-hidden">
          <img src={imageSrc} alt="Post Content" className={`w-full h-full object-cover transition-opacity duration-500 ${isGeneratingImage ? 'opacity-50 scale-105 blur-sm' : 'opacity-100'}`} />
          
          {isGeneratingImage && (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-purple border-t-transparent"></div>
             </div>
          )}

          <div className="absolute bottom-4 right-4 flex gap-3">
            <button 
              onClick={() => setShowAiPrompt(true)}
              className="bg-purple-600 text-white p-3 rounded-full shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-all transform hover:scale-105 border border-white/20"
              title="Generate with AI"
            >
              <IconSparkles className="w-5 h-5" />
            </button>
            <button 
              onClick={() => triggerFileInput(false)}
              className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all border border-white/20 shadow-lg"
            >
              <IconImage className="w-5 h-5" />
            </button>
            <button 
              onClick={() => triggerFileInput(true)}
              className="bg-brand-orange text-white p-3 rounded-full shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all transform hover:scale-105"
            >
              <IconCamera className="w-5 h-5" />
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>

        {/* Text Fields */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Headline</label>
            <input 
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2 focus:outline-none focus:border-brand-purple bg-transparent placeholder-slate-300 transition-colors"
              placeholder="Catchy Headline..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Caption</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="w-full text-base leading-relaxed text-slate-600 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-purple/10 focus:border-brand-purple bg-slate-50/50 resize-none transition-all placeholder-slate-300"
              placeholder="Write your caption here..."
            />
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm text-brand-purple">
                 {template.platform === 'Instagram' && <IconInstagram className="w-5 h-5" />}
                 {template.platform === 'Facebook' && <IconFacebook className="w-5 h-5" />}
                 {template.platform === 'TikTok' && <IconTikTok className="w-5 h-5" />}
             </div>
             <div>
               <p className="text-sm font-bold text-slate-900">Posting to {template.platform}</p>
               <p className="text-xs text-slate-500">Tone: {template.tone}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
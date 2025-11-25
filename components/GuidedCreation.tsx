
import React, { useState, useRef } from 'react';
import { IconArrowLeft, IconImage, IconVideo, IconLayout, IconSparkles, IconCamera } from './Icons';
import { ViewState } from '../types';

interface GuidedCreationProps {
  onSubmit: (text: string, format: 'Post' | 'Reel' | 'Story') => void;
  onPhotoSubmit: (image: string, format: 'Post' | 'Story' | 'Reel') => void;
  setView: (view: ViewState) => void;
}

const GuidedCreation: React.FC<GuidedCreationProps> = ({ onSubmit, onPhotoSubmit, setView }) => {
  const [selectedFormat, setSelectedFormat] = useState<'Post' | 'Reel' | 'Story' | null>(null);
  const [topic, setTopic] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!selectedFormat || !topic.trim()) return;
    onSubmit(topic, selectedFormat);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
            // Infer format from file type if possible, or default to Post
            const isVideo = file.type.startsWith('video');
            const format = isVideo ? 'Reel' : 'Post';
            onPhotoSubmit(ev.target.result as string, format);
        }
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

  return (
    <div className="flex flex-col h-full bg-slate-50 relative animate-fade-in">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,video/*" 
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 sticky top-0 z-20 bg-slate-50 border-b border-slate-100/50">
        <button onClick={() => setView(ViewState.HOME)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <IconArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Studio</h1>
      </div>

      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        
        <div className="mb-3 mt-2">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Start with Media</h2>
          <p className="text-slate-500 text-xs">Photo or Video? We'll write the caption.</p>
        </div>

        {/* Photo/Video Entry Points */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => triggerFileInput(true)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 hover:border-brand-orange transition-all group"
            >
               <div className="w-10 h-10 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconCamera className="w-5 h-5" />
               </div>
               <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">Camera</span>
            </button>
            <button 
              onClick={() => triggerFileInput(false)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 hover:border-brand-purple transition-all group"
            >
               <div className="w-10 h-10 rounded-full bg-purple-50 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconImage className="w-5 h-5" />
               </div>
               <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">Media Library</span>
            </button>
        </div>

        <div className="flex items-center gap-4 mb-6 opacity-60">
           <div className="h-[1px] flex-1 bg-slate-300"></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase">OR</span>
           <div className="h-[1px] flex-1 bg-slate-300"></div>
        </div>

        <div className="mb-3">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Start with an Idea</h2>
          <p className="text-slate-500 text-xs">Describe a concept and let AI generate everything.</p>
        </div>

        {/* Format Selection Grid */}
        <div className="grid grid-cols-1 gap-3 mb-6">
           <button 
             onClick={() => setSelectedFormat('Post')}
             className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all duration-200 ${selectedFormat === 'Post' ? 'border-brand-purple bg-purple-50 shadow-sm' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
           >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedFormat === 'Post' ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-500'}`}>
               <IconImage className="w-5 h-5" />
             </div>
             <div className="text-left">
               <h3 className={`font-bold text-sm ${selectedFormat === 'Post' ? 'text-brand-purple' : 'text-slate-800'}`}>Feed Post</h3>
               <p className="text-[10px] text-slate-500">Square photo for Insta & FB</p>
             </div>
           </button>

           <button 
             onClick={() => setSelectedFormat('Reel')}
             className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all duration-200 ${selectedFormat === 'Reel' ? 'border-brand-purple bg-purple-50 shadow-sm' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
           >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedFormat === 'Reel' ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-500'}`}>
               <IconVideo className="w-5 h-5" />
             </div>
             <div className="text-left">
               <h3 className={`font-bold text-sm ${selectedFormat === 'Reel' ? 'text-brand-purple' : 'text-slate-800'}`}>Viral Reel</h3>
               <p className="text-[10px] text-slate-500">Script for TikTok & Reels</p>
             </div>
           </button>

           <button 
             onClick={() => setSelectedFormat('Story')}
             className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all duration-200 ${selectedFormat === 'Story' ? 'border-brand-purple bg-purple-50 shadow-sm' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
           >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedFormat === 'Story' ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-500'}`}>
               <IconLayout className="w-5 h-5" />
             </div>
             <div className="text-left">
               <h3 className={`font-bold text-sm ${selectedFormat === 'Story' ? 'text-brand-purple' : 'text-slate-800'}`}>24h Ephemeral</h3>
               <p className="text-[10px] text-slate-500">Vertical update for Stories</p>
             </div>
           </button>
        </div>

        {/* Topic Input */}
        {selectedFormat && (
           <div className="animate-slide-up">
             <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">What's the vibe?</label>
             <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={selectedFormat === 'Reel' ? "e.g. Behind the scenes of our new product launch..." : "e.g. Announcing our summer flash sale..."}
                className="w-full p-3 rounded-xl border-0 shadow-sm bg-white text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-purple/20 focus:outline-none resize-none h-24 mb-4"
             />
             
             <button 
               onClick={handleSubmit}
               disabled={!topic.trim()}
               className="w-full py-3 bg-brand-purple text-white rounded-full font-bold text-sm shadow-lg shadow-purple-300 hover:bg-purple-800 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
             >
               <IconSparkles className="w-4 h-4" />
               <span>Generate Magic ✨</span>
             </button>
           </div>
        )}

      </div>
    </div>
  );
};

export default GuidedCreation;

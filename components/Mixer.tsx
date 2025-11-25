
import React, { useState, useRef, useEffect } from 'react';
import { MixerData, Platform, DesignState, FeedPreviewData } from '../types';
import { IconArrowLeft, IconArrowRight, IconCheck, IconPalette, IconLayers, IconGrid, IconInstagram, IconFacebook, IconTikTok, IconCamera, IconImage, IconSparkles, IconType, IconContrast, IconTrash, IconSquare, IconPortrait, IconPortraitTall, IconFrame, IconQuote } from './Icons';
import { generateImage } from '../services/geminiService';

interface MixerProps {
  data: MixerData;
  initialDesign: DesignState | null;
  onBack: () => void;
  onNext: (data: FeedPreviewData) => void;
}

const Mixer: React.FC<MixerProps> = ({ data, initialDesign, onBack, onNext }) => {
  const isLoading = data.isLoading || false;
  
  // Granular Loading Logic:
  // If we have visuals (e.g. from user upload), we show the preview immediately.
  // Only block the UI if we have NOTHING to show.
  const hasVisuals = data.visuals && data.visuals.length > 0;
  const hasCaptions = data.captions && data.captions.length > 0;
  
  const showPreviewSkeleton = isLoading && !hasVisuals;
  const showCaptionSkeleton = isLoading && !hasCaptions;

  // TABS
  const [activeTab, setActiveTab] = useState<'Visuals' | 'Copy' | 'Design'>('Visuals');
  
  // VISUALS STATE
  const [visuals, setVisuals] = useState(data.visuals || []);
  const [selectedVisual, setSelectedVisual] = useState(data.visuals?.[0] || { url: '', prompt: '', id: '' });
  
  // ASPECT RATIO STATE
  const [aspectRatio, setAspectRatio] = useState(initialDesign?.aspectRatio || 'aspect-square');

  // CAPTION STATE
  const [selectedCaption, setSelectedCaption] = useState(data.captions?.[0] || { text: 'Drafting caption...', tone: '...', id: '' });
  const [captionText, setCaptionText] = useState(initialDesign?.overlayText ? selectedCaption.text : ''); 

  // DESIGN STATE
  const [designMode, setDesignMode] = useState<'Filters' | 'Text' | 'Frames'>('Filters');
  const [activeFilter, setActiveFilter] = useState(initialDesign?.filter || 'filter-none');
  
  // FREEFORM TEXT STATE
  const [overlayText, setOverlayText] = useState(initialDesign?.overlayText || '');
  const [overlayColor, setOverlayColor] = useState(initialDesign?.overlayColor || 'text-white');
  const [overlayBg, setOverlayBg] = useState(initialDesign?.overlayBg || 'bg-black/50');
  const [textPos, setTextPos] = useState(initialDesign?.textPos || { x: 50, y: 50 }); 
  const [textSize, setTextSize] = useState(initialDesign?.textSize || 100); 

  // FRAMES STATE
  const [activeFrame, setActiveFrame] = useState<string | null>(initialDesign?.activeFrame || null);

  // META STATE
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.INSTAGRAM);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragItemRef = useRef<'text' | null>(null);

  // SYNC DATA WHEN IT ARRIVES (Handling the Async Load)
  useEffect(() => {
    // Update visuals if they arrive late
    if (data.visuals.length > 0 && visuals.length === 0) {
        setVisuals(data.visuals);
        setSelectedVisual(data.visuals[0]);
    } else if (data.visuals.length > visuals.length) {
        // If new visuals added (e.g. hybrid loading), merge them
        setVisuals(data.visuals);
    }

    // Update captions when they arrive
    if (data.captions.length > 0) {
        // Only auto-select if we don't have one yet
        if (selectedCaption.text === 'Drafting caption...') {
            setSelectedCaption(data.captions[0]);
            // Only overwrite text if user hasn't started typing
            if (!captionText) setCaptionText(data.captions[0].text);
        }
    }
    
    // Smart Aspect Ratio Default only if not restored
    if (!initialDesign && !isLoading && visuals.length > 0) {
        if (data.format === 'Story' || data.format === 'Reel') {
            setAspectRatio('aspect-[9/16]');
        } else {
            setAspectRatio('aspect-square');
        }
    }
  }, [isLoading, data, visuals.length]);

  const filters: Record<string, string> = {
    'Original': 'filter-none',
    'Vivid': 'contrast-125 saturate-150',
    'Moody': 'brightness-75 contrast-125 sepia-[.3]',
    'Soft': 'brightness-110 contrast-90 saturate-50',
    'B&W': 'grayscale',
  };

  const frames: Record<string, any> = {
     'Polaroid': { label: 'Polaroid', class: 'border-[12px] border-b-[40px] border-white shadow-inner box-border' },
     'Cinematic': { label: 'Cinematic', overlay: 'bg-gradient-to-t from-black/90 via-black/20 to-transparent' },
     'Promo': { label: 'Promo', class: 'border-[8px] border-brand-orange box-border', badge: 'LIMITED OFFER' },
     'Elegant': { label: 'Elegant', class: 'border-[1px] border-white m-3 outline outline-1 outline-white outline-offset-4' },
     'News': { label: 'News', overlay: 'bg-white h-16 absolute bottom-0 left-0 right-0' }, 
     'Quote': { label: 'Quote', overlay: 'bg-black/40', icon: 'quote' }
  };

  const handleNext = () => {
    const designState: DesignState = {
        filter: activeFilter,
        overlayText,
        overlayColor,
        overlayBg,
        textPos,
        textSize,
        activeFrame,
        aspectRatio
    };

    onNext({
        platform: selectedPlatform,
        image: selectedVisual.url,
        caption: captionText,
        design: designState
    });
  };

  // --- DRAG LOGIC ---
  const handlePointerDown = (e: React.PointerEvent, item: 'text') => {
    e.preventDefault();
    e.stopPropagation();
    dragItemRef.current = item;
    setIsDragging(true);
    if (canvasRef.current) {
        canvasRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragItemRef.current || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values 0-100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setTextPos({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragItemRef.current = null;
    setIsDragging(false);
    if (canvasRef.current) {
        canvasRef.current.releasePointerCapture(e.pointerId);
    }
  };
  // ------------------

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
           const newVisual = {
             id: `user-${Date.now()}`,
             prompt: 'User Upload',
             url: ev.target.result as string
           };
           setVisuals([newVisual, ...visuals]);
           setSelectedVisual(newVisual);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateGeminiImage = async () => {
    if (isGeneratingImg) return;
    setIsGeneratingImg(true);
    try {
        const prompt = selectedVisual.prompt || "High quality aesthetic social media image";
        const base64Image = await generateImage(prompt);
        
        const newVisual = {
            id: `gemini-${Date.now()}`,
            prompt: prompt,
            url: base64Image
        };
        
        setVisuals([newVisual, ...visuals]);
        setSelectedVisual(newVisual);
    } catch (e) {
        alert("Failed to generate image. Please try again.");
    } finally {
        setIsGeneratingImg(false);
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

  const handleCaptionSelect = (c: any) => {
      setSelectedCaption(c);
      setCaptionText(c.text);
  };

  const renderActiveFrame = () => {
     if (!activeFrame) return null;
     const frame = frames[activeFrame];
     return (
        <div className={`absolute inset-0 pointer-events-none z-20 ${frame.class || ''}`}>
           {frame.overlay && <div className={`absolute inset-0 ${frame.overlay}`}></div>}
           {frame.badge && (
              <div className="absolute top-4 right-4 bg-brand-orange text-white text-[10px] font-black px-2 py-1 transform rotate-6 shadow-lg">
                {frame.badge}
              </div>
           )}
           {frame.icon === 'quote' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                 <IconQuote className="w-24 h-24 text-white" />
              </div>
           )}
        </div>
     );
  };

  const isVertical = aspectRatio === 'aspect-[9/16]' || aspectRatio === 'aspect-[4/5]';
  const containerClass = isVertical 
      ? 'h-full w-auto' 
      : 'w-full max-w-sm h-auto';

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload}
      />

      {/* Header */}
      <div className="px-4 py-3 bg-white flex justify-between items-center border-b border-slate-100 shadow-sm z-20">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50">
          <IconArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Creative Mixer</h1>
        <button 
          onClick={handleNext}
          disabled={showPreviewSkeleton} // Only disable if we have NO image
          className="bg-brand-purple text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-purple-200 active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          Next <IconArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* PREVIEW AREA */}
      <div className="flex-1 bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative select-none">
        {showPreviewSkeleton ? (
             <div className="w-full max-w-sm aspect-square bg-slate-800 animate-pulse flex items-center justify-center border border-slate-700 rounded-2xl">
                <div className="text-slate-500 flex flex-col items-center">
                    <IconImage className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-widest">Mixing...</span>
                </div>
             </div>
        ) : (
            <div 
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className={`relative shadow-2xl overflow-hidden group touch-none transition-all duration-300 mx-auto ${aspectRatio} ${containerClass}`}
            >
               {/* LAYER 1: BASE IMAGE + FILTER */}
               <div className={`w-full h-full ${activeFilter} pointer-events-none transition-all duration-300`}>
                 <img src={selectedVisual.url} className="w-full h-full object-cover" alt="Preview" />
               </div>

               {/* LAYER 2: FRAMES */}
               {renderActiveFrame()}

               {/* LAYER 3: DRAGGABLE TEXT */}
               {overlayText && (
                 <div 
                    onPointerDown={(e) => handlePointerDown(e, 'text')}
                    style={{ 
                        left: `${textPos.x}%`, 
                        top: `${textPos.y}%`, 
                        transform: `translate(-50%, -50%) scale(${textSize / 100})`,
                        cursor: 'move'
                    }}
                    className={`absolute z-30 touch-none ${isDragging ? 'border border-dashed border-white/50 bg-black/10' : ''}`}
                 >
                    <span className={`
                      text-2xl font-black uppercase tracking-tight text-center px-4 py-2 whitespace-nowrap select-none
                      ${overlayColor} ${overlayBg}
                      ${overlayBg === 'bg-transparent' && overlayColor === 'text-white' ? 'drop-shadow-lg' : 'shadow-lg'}
                    `}>
                      {overlayText}
                    </span>
                 </div>
               )}
              
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur text-white px-2 py-1 rounded flex items-center gap-1 text-[10px] pointer-events-none z-40">
                 {selectedPlatform === Platform.INSTAGRAM && <IconInstagram className="w-3 h-3" />}
                 {selectedPlatform === Platform.FACEBOOK && <IconFacebook className="w-3 h-3" />}
                 {selectedPlatform === Platform.TIKTOK && <IconTikTok className="w-3 h-3" />}
                 Preview
              </div>
            </div>
        )}
      </div>

      {/* CAPTION PREVIEW */}
      <div className="bg-white px-6 py-3 border-t border-slate-100">
        {showCaptionSkeleton ? (
            <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
            </div>
        ) : (
            <p className="text-sm text-slate-600 line-clamp-2 font-medium">
              {captionText || "Write a caption or select a suggestion..."}
            </p>
        )}
      </div>

      {/* INGREDIENTS (Bottom Tabs) */}
      <div className="bg-white border-t border-slate-100 safe-area-pb">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('Visuals')}
            className={`flex-1 py-3 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'Visuals' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-slate-400'}`}
          >
            <IconGrid className="w-5 h-5" /> Visuals
          </button>
          <button 
            onClick={() => setActiveTab('Copy')}
            className={`flex-1 py-3 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'Copy' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-slate-400'}`}
          >
            <IconLayers className="w-5 h-5" /> Copy
          </button>
          <button 
            onClick={() => setActiveTab('Design')}
            className={`flex-1 py-3 text-xs font-bold uppercase flex flex-col items-center gap-1 ${activeTab === 'Design' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-slate-400'}`}
          >
            <IconPalette className="w-5 h-5" /> Design
          </button>
        </div>

        <div className="h-56 overflow-y-auto bg-slate-50">
          
          {/* VISUALS TAB */}
          {activeTab === 'Visuals' && (
            <div className="p-4 space-y-4">
              <div className="flex justify-center gap-4 mb-2">
                 <button onClick={() => setAspectRatio('aspect-square')} className={`flex flex-col items-center gap-1 ${aspectRatio === 'aspect-square' ? 'text-brand-purple' : 'text-slate-400'}`}>
                    <IconSquare className="w-6 h-6" />
                    <span className="text-[9px] font-bold">1:1</span>
                 </button>
                 <button onClick={() => setAspectRatio('aspect-[9/16]')} className={`flex flex-col items-center gap-1 ${aspectRatio === 'aspect-[9/16]' ? 'text-brand-purple' : 'text-slate-400'}`}>
                    <IconPortrait className="w-6 h-6" />
                    <span className="text-[9px] font-bold">9:16</span>
                 </button>
                 <button onClick={() => setAspectRatio('aspect-[4/5]')} className={`flex flex-col items-center gap-1 ${aspectRatio === 'aspect-[4/5]' ? 'text-brand-purple' : 'text-slate-400'}`}>
                    <IconPortraitTall className="w-6 h-6" />
                    <span className="text-[9px] font-bold">4:5</span>
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                   onClick={() => triggerFileInput(false)}
                   className="aspect-video rounded-lg border-2 border-dashed border-brand-orange/50 bg-orange-50 flex flex-col items-center justify-center gap-1 text-brand-orange hover:bg-orange-100 transition-colors"
                >
                   <div className="flex gap-1">
                     <IconCamera className="w-4 h-4" />
                     <IconImage className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-bold">Add Your Own</span>
                </button>

                {showPreviewSkeleton ? (
                    <>
                      <div className="aspect-video rounded-lg bg-slate-200 animate-pulse"></div>
                      <div className="aspect-video rounded-lg bg-slate-200 animate-pulse"></div>
                    </>
                ) : (
                    <>
                      {visuals.map((v) => (
                          <button 
                          key={v.id} 
                          onClick={() => setSelectedVisual(v)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedVisual.id === v.id ? 'border-brand-purple ring-2 ring-purple-100' : 'border-transparent'}`}
                          >
                          <img src={v.url} className="w-full h-full object-cover" />
                          {selectedVisual.id === v.id && <div className="absolute inset-0 bg-brand-purple/20 flex items-center justify-center"><IconCheck className="w-6 h-6 text-white" /></div>}
                          </button>
                      ))}
                      <button 
                          onClick={handleGenerateGeminiImage}
                          disabled={isGeneratingImg}
                          className="aspect-video rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 bg-white hover:bg-slate-50"
                      >
                          <IconSparkles className="w-5 h-5 mb-1 text-brand-purple" />
                          <span className="text-[10px] font-bold">{isGeneratingImg ? "Creating..." : "Generate with AI"}</span>
                      </button>
                    </>
                )}
              </div>
            </div>
          )}

          {/* COPY TAB */}
          {activeTab === 'Copy' && (
            <div className="space-y-4 p-4">
              {showCaptionSkeleton ? (
                  <div className="space-y-2">
                    <div className="h-24 bg-slate-200 rounded-xl w-full animate-pulse"></div>
                    <div className="h-12 bg-slate-200 rounded-xl w-full animate-pulse"></div>
                  </div>
              ) : (
                  <>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm relative focus-within:border-brand-purple transition-colors">
                        <label className="text-[9px] font-bold uppercase text-slate-400 mb-2 block flex justify-between">
                           <span>Editor</span>
                           <span className="text-brand-purple">Write or Edit below</span>
                        </label>
                        <textarea
                            value={captionText}
                            onChange={(e) => setCaptionText(e.target.value)}
                            className="w-full text-sm text-slate-900 bg-white outline-none resize-none h-20 placeholder-slate-400"
                            placeholder="Select a suggestion below to edit, or write your own..."
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase text-slate-400 pl-1">AI Suggestions (Tap to Edit)</p>
                        {data.captions.map((c) => (
                            <button 
                            key={c.id}
                            onClick={() => handleCaptionSelect(c)}
                            className={`w-full text-left p-3 rounded-xl border text-sm transition-all group ${selectedCaption.id === c.id ? 'bg-purple-50 border-brand-purple text-brand-purple' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                            >
                            <span className="text-[10px] font-bold uppercase opacity-70 mb-1 flex justify-between">
                                {c.tone}
                            </span>
                            {c.text}
                            </button>
                        ))}
                    </div>
                  </>
              )}
            </div>
          )}

          {/* DESIGN TAB */}
          {activeTab === 'Design' && (
             <div className="flex flex-col h-full">
                {/* Sub-Navigation */}
                <div className="flex px-4 py-2 gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 bg-white">
                   <button onClick={() => setDesignMode('Filters')} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 ${designMode === 'Filters' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                      <IconContrast className="w-3 h-3" /> Filters
                   </button>
                   <button onClick={() => setDesignMode('Text')} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 ${designMode === 'Text' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                      <IconType className="w-3 h-3" /> Text
                   </button>
                   <button onClick={() => setDesignMode('Frames')} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 ${designMode === 'Frames' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                      <IconFrame className="w-3 h-3" /> Frames
                   </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 bg-slate-50">
                   
                   {/* FILTERS MODE */}
                   {designMode === 'Filters' && (
                      <div className="grid grid-cols-3 gap-3">
                         {Object.keys(filters).map((f) => (
                            <button 
                               key={f} 
                               onClick={() => setActiveFilter(filters[f])}
                               className={`aspect-square rounded-lg bg-white border-2 overflow-hidden relative group ${activeFilter === filters[f] ? 'border-brand-purple' : 'border-transparent'}`}
                            >
                               <div className={`w-full h-full ${filters[f]}`}>
                                  <img src={selectedVisual.url} className="w-full h-full object-cover" />
                               </div>
                               <span className="absolute bottom-1 left-1 right-1 text-center bg-black/50 text-white text-[9px] font-bold rounded py-0.5 backdrop-blur-sm">{f}</span>
                            </button>
                         ))}
                      </div>
                   )}

                   {/* TEXT OVERLAY MODE */}
                   {designMode === 'Text' && (
                      <div className="space-y-4">
                         <input 
                            type="text" 
                            value={overlayText}
                            onChange={(e) => setOverlayText(e.target.value)}
                            placeholder="Type overlay text..." 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple text-sm"
                         />
                         
                         <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-bold text-slate-400">Size</span>
                                <span className="text-xs font-bold text-slate-900">{textSize}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="50" 
                                max="250" 
                                value={textSize} 
                                onChange={(e) => setTextSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                            />
                         </div>

                         <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">Color</span>
                            <div className="flex gap-2">
                               {['text-white', 'text-black', 'text-brand-purple', 'text-brand-orange'].map(c => (
                                  <button key={c} onClick={() => setOverlayColor(c)} className={`w-6 h-6 rounded-full border border-slate-200 ${c.replace('text-', 'bg-')} ${overlayColor === c ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} />
                               ))}
                            </div>
                         </div>

                         <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">Background</span>
                            <div className="flex gap-2 text-[10px] font-bold">
                               <button onClick={() => setOverlayBg('bg-transparent')} className={`px-2 py-1 rounded border ${overlayBg === 'bg-transparent' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500'}`}>None</button>
                               <button onClick={() => setOverlayBg('bg-black/50')} className={`px-2 py-1 rounded border ${overlayBg === 'bg-black/50' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500'}`}>Dim</button>
                               <button onClick={() => setOverlayBg('bg-brand-purple')} className={`px-2 py-1 rounded border ${overlayBg === 'bg-brand-purple' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500'}`}>Solid</button>
                            </div>
                         </div>

                         {overlayText && (
                            <div className="text-[10px] text-center text-slate-400 italic">
                                ✨ Drag text on image to move
                            </div>
                         )}
                         
                         {overlayText && (
                            <button onClick={() => setOverlayText('')} className="w-full py-2 flex items-center justify-center gap-2 text-red-500 text-xs font-bold hover:bg-red-50 rounded-lg transition-colors">
                               <IconTrash className="w-4 h-4" /> Remove Text
                            </button>
                         )}
                      </div>
                   )}

                   {/* FRAMES MODE */}
                   {designMode === 'Frames' && (
                      <div className="grid grid-cols-2 gap-3">
                         <button 
                            onClick={() => setActiveFrame(null)}
                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${activeFrame === null ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
                         >
                            <span className="text-xs font-bold">None</span>
                         </button>
                         {Object.keys(frames).map(frame => (
                            <button 
                               key={frame} 
                               onClick={() => setActiveFrame(frame)}
                               className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${activeFrame === frame ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
                            >
                               <span className="text-xs font-bold">{frame}</span>
                            </button>
                         ))}
                      </div>
                   )}
                </div>
             </div>
          )}
        </div>
        
        {/* Platform Toggle */}
        <div className="flex justify-center gap-2 p-2 bg-white border-t border-slate-100">
          {[Platform.INSTAGRAM, Platform.FACEBOOK, Platform.TIKTOK].map((p) => (
             <button 
               key={p}
               onClick={() => setSelectedPlatform(p)}
               className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${selectedPlatform === p ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-500'}`}
             >
               {p}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mixer;

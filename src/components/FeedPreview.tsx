
import React, { useState } from 'react';
import { FeedPreviewData, Platform } from '../types';
import { IconArrowLeft, IconCheck, IconInstagram, IconFacebook, IconTikTok, IconQuote, IconCalendar, IconClock } from './Icons';

interface FeedPreviewProps {
  data: FeedPreviewData;
  businessName: string; // Dynamic Name
  onBack: () => void;
  onPublish: () => void;
}

const FeedPreview: React.FC<FeedPreviewProps> = ({ data, businessName, onBack, onPublish }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [publishType, setPublishType] = useState<'Now' | 'Later'>('Now');

  const handlePublish = () => {
    setPublishType('Now');
    setIsPublishing(true);
    setTimeout(onPublish, 2000);
  };

  const handleScheduleConfirm = () => {
    if (!scheduleDate || !scheduleTime) return;
    setShowSchedule(false);
    setPublishType('Later');
    setIsPublishing(true);
    setTimeout(onPublish, 2000);
  };

  const frames: Record<string, any> = {
     'Polaroid': { label: 'Polaroid', class: 'border-[12px] border-b-[40px] border-white shadow-inner box-border' },
     'Cinematic': { label: 'Cinematic', overlay: 'bg-gradient-to-t from-black/90 via-black/20 to-transparent' },
     'Promo': { label: 'Promo', class: 'border-[8px] border-brand-orange box-border', badge: 'LIMITED OFFER' },
     'Elegant': { label: 'Elegant', class: 'border-[1px] border-white m-3 outline outline-1 outline-white outline-offset-4' },
     'News': { label: 'News', overlay: 'bg-white h-16 absolute bottom-0 left-0 right-0' },
     'Quote': { label: 'Quote', overlay: 'bg-black/40', icon: 'quote' }
  };

  const renderActiveFrame = () => {
     if (!data.design.activeFrame) return null;
     const frame = frames[data.design.activeFrame];
     if (!frame) return null;
     
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

  const LayeredCanvas = ({ styleClass = "" }: { styleClass?: string }) => (
      <div className={`relative w-full overflow-hidden ${data.design.aspectRatio} ${styleClass}`}>
         <div className={`w-full h-full ${data.design.filter}`}>
            <img src={data.image} className="w-full h-full object-cover" alt="Post content" />
         </div>
         {renderActiveFrame()}
         {data.design.overlayText && (
             <div 
                style={{ 
                    left: `${data.design.textPos.x}%`, 
                    top: `${data.design.textPos.y}%`, 
                    transform: `translate(-50%, -50%) scale(${data.design.textSize / 100})`,
                }}
                className="absolute z-30 w-full flex justify-center pointer-events-none"
             >
                <span className={`
                  text-lg sm:text-2xl font-black uppercase tracking-tight text-center px-4 py-2 whitespace-nowrap
                  ${data.design.overlayColor} ${data.design.overlayBg}
                  ${data.design.overlayBg === 'bg-transparent' && data.design.overlayColor === 'text-white' ? 'drop-shadow-lg' : 'shadow-lg'}
                `}>
                  {data.design.overlayText}
                </span>
             </div>
         )}
      </div>
  );

  // --- INSTAGRAM LAYOUT ---
  const InstagramLayout = () => (
    <div className="bg-white min-h-full">
       <div className="flex gap-4 p-4 border-b border-slate-50 overflow-x-hidden no-scrollbar">
          {['Your Story', 'alex_design', 'studio_hq', 'nails_art'].map((u, i) => (
             <div key={u} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-14 h-14 rounded-full p-[2px] ${i===0 ? 'border border-slate-200' : 'bg-gradient-to-tr from-yellow-400 to-purple-600'}`}>
                   <div className="w-full h-full bg-slate-100 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-[10px] text-slate-500 max-w-[60px] truncate">{u}</span>
             </div>
          ))}
       </div>

       <div className="pb-8">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-brand-purple">
                {businessName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{businessName}</p>
                <p className="text-[10px] text-slate-500">Original Audio</p>
              </div>
            </div>
            <div className="text-slate-900 font-bold">...</div>
          </div>

          <LayeredCanvas />

          <div className="p-3">
             <div className="flex justify-between mb-3">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-900"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-900"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-900"></div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-900"></div>
             </div>
             <p className="text-sm text-slate-900">
               <span className="font-bold mr-2">{businessName}</span>
               {data.caption}
             </p>
             <p className="text-[10px] text-slate-400 mt-1 uppercase">2 minutes ago</p>
          </div>
       </div>
    </div>
  );

  // --- FACEBOOK LAYOUT ---
  const FacebookLayout = () => (
    <div className="bg-slate-100 min-h-full pt-2">
       <div className="bg-white p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {businessName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{businessName}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                   <span>Just now</span> • <span>🌍</span>
                </div>
              </div>
            </div>
            <div className="text-slate-500 font-bold mb-4">...</div>
          </div>

          <p className="text-sm text-slate-800 mb-3 whitespace-pre-wrap">{data.caption}</p>

          <div className="-mx-4">
             <LayeredCanvas />
          </div>

          <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-slate-100 text-slate-500 text-xs font-bold">
             <div className="flex items-center gap-1"><span>👍</span> Like</div>
             <div className="flex items-center gap-1"><span>💬</span> Comment</div>
             <div className="flex items-center gap-1"><span>↗️</span> Share</div>
          </div>
       </div>
    </div>
  );

  // --- TIKTOK LAYOUT ---
  const TikTokLayout = () => (
    <div className="bg-black h-full relative flex items-center justify-center overflow-hidden">
       <div className="absolute inset-0 opacity-50 bg-slate-900"></div>
       <div className="w-full h-full relative max-w-md mx-auto">
           <div className="absolute inset-0 flex items-center justify-center bg-black">
             <LayeredCanvas styleClass={data.design.aspectRatio === 'aspect-[9/16]' ? 'h-full object-cover' : ''} />
           </div>

           <div className="absolute right-2 bottom-20 flex flex-col items-center gap-6 z-30">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-lg"><div className="w-full h-full bg-purple-600 rounded-full"></div></div>
              <div className="flex flex-col items-center gap-1 text-shadow-sm">
                 <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl">♥</div>
                 <span className="text-white text-[10px] font-bold">842</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-shadow-sm">
                 <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl">💬</div>
                 <span className="text-white text-[10px] font-bold">24</span>
              </div>
              <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl">↗</div>
           </div>

           <div className="absolute bottom-0 left-0 right-12 p-4 pb-8 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h4 className="text-white font-bold text-sm mb-1 text-shadow-sm">@{businessName.replace(/\s+/g, '_').toLowerCase()}</h4>
              <p className="text-white/90 text-xs line-clamp-2 mb-2 text-shadow-sm">{data.caption}</p>
              <div className="flex items-center gap-2 text-white/70 text-[10px]">
                 <span className="animate-spin-slow">🎵</span> Original Sound - Trending
              </div>
           </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Publishing Overlay */}
      {isPublishing && (
        <div className="absolute inset-0 z-50 bg-brand-purple/95 flex flex-col items-center justify-center text-white animate-fade-in backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-white/20 border-t-brand-orange rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold">
             {publishType === 'Now' ? `Posting to ${data.platform}...` : `Scheduling...`}
          </h2>
          {publishType === 'Later' && (
             <p className="text-purple-200 text-sm mt-2">{scheduleDate} at {scheduleTime}</p>
          )}
          
          {/* Confetti Explosion */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-confetti-slow"></div>
             <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-pink-500 rounded-full animate-confetti-medium"></div>
             <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-confetti-fast"></div>
             <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-brand-orange rounded-full animate-confetti-medium" style={{ animationDelay: '200ms' }}></div>
             <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full animate-confetti-fast" style={{ animationDelay: '500ms' }}></div>
          </div>
        </div>
      )}

      {/* Scheduling Modal */}
      {showSchedule && (
         <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-brand-purple">
                     <IconCalendar className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="text-lg font-bold text-slate-900">Schedule Post</h2>
                     <p className="text-xs text-slate-500">Choose a date and time</p>
                  </div>
               </div>

               <div className="space-y-4 mb-6">
                  <div>
                     <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Date</label>
                     <input 
                        type="date" 
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-purple bg-white text-slate-900"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Time</label>
                     <div className="relative">
                        <input 
                           type="time" 
                           value={scheduleTime}
                           onChange={(e) => setScheduleTime(e.target.value)}
                           className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-purple pl-10 bg-white text-slate-900"
                        />
                        <IconClock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                     </div>
                  </div>
               </div>

               <div className="flex gap-3">
                  <button 
                     onClick={() => setShowSchedule(false)}
                     className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                     onClick={handleScheduleConfirm}
                     disabled={!scheduleDate || !scheduleTime}
                     className="flex-1 py-3 rounded-xl text-sm font-bold bg-brand-purple text-white shadow-lg shadow-purple-200 disabled:opacity-50 disabled:shadow-none"
                  >
                     Confirm
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* App Header (Sticky) */}
      <div className="px-4 py-3 bg-white flex justify-between items-center border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-600">
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
            <h1 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preview</h1>
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-brand-purple">
               {data.platform === Platform.INSTAGRAM && <IconInstagram className="w-3 h-3" />}
               {data.platform === Platform.FACEBOOK && <IconFacebook className="w-3 h-3" />}
               {data.platform === Platform.TIKTOK && <IconTikTok className="w-3 h-3" />}
               {data.platform}
            </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowSchedule(true)}
             className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors"
           >
             Schedule
           </button>
           <button 
             onClick={handlePublish}
             className="bg-brand-purple text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-purple-200 active:scale-95 flex items-center gap-2"
           >
             Publish
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
         {data.platform === Platform.INSTAGRAM && <InstagramLayout />}
         {data.platform === Platform.FACEBOOK && <FacebookLayout />}
         {data.platform === Platform.TIKTOK && <TikTokLayout />}
      </div>
    </div>
  );
};

export default FeedPreview;

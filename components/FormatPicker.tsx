
import React from 'react';
import { IconImage, IconVideo, IconArrowLeft } from './Icons';

interface FormatPickerProps {
  onSelect: (format: 'Post' | 'Reel') => void;
  onCancel: () => void;
}

const FormatPicker: React.FC<FormatPickerProps> = ({ onSelect, onCancel }) => {
  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Choose Format</h2>
          <button onClick={onCancel} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
            <span className="text-xs font-bold uppercase">Cancel</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onSelect('Post')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-purple-50 border-2 border-transparent hover:border-brand-purple transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-purple group-hover:scale-110 transition-transform">
              <IconImage className="w-7 h-7" />
            </div>
            <span className="font-bold text-slate-800">Photo Post</span>
          </button>

          <button 
             onClick={() => onSelect('Reel')}
             className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-orange-50 border-2 border-transparent hover:border-brand-orange transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-orange group-hover:scale-110 transition-transform">
              <IconVideo className="w-7 h-7" />
            </div>
            <span className="font-bold text-slate-800">Video Reel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormatPicker;

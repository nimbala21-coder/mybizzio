import React from 'react';
import { GeneratedResponse, SocialPostTemplate, Platform } from '../types';
import { IconArrowLeft } from './Icons';

interface TemplateSelectorProps {
  data: GeneratedResponse;
  onSelect: (template: SocialPostTemplate) => void;
  onBack: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ data, onSelect, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-brand-light">
      <div className="bg-white px-6 py-4 shadow-sm z-10 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
          <IconArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-none">Choose a Vibe</h2>
          <p className="text-xs text-slate-500 mt-1">{data.intent}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {data.templates.map((template) => (
          <div 
            key={template.id} 
            onClick={() => onSelect(template)}
            className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-900/5 border border-slate-100 transform transition-all duration-200 active:scale-95 cursor-pointer group"
          >
            {/* Mock Preview Header based on platform */}
            <div className={`h-2 w-full ${
              template.platform === Platform.INSTAGRAM ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500' :
              template.platform === Platform.FACEBOOK ? 'bg-blue-600' :
              'bg-black'
            }`} />
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider
                   ${template.platform === Platform.INSTAGRAM ? 'text-pink-600 bg-pink-50' :
                     template.platform === Platform.FACEBOOK ? 'text-blue-600 bg-blue-50' :
                     'text-slate-800 bg-slate-100'
                   }`}>
                  {template.platform}
                </span>
                <span className="text-xs text-brand-purple font-medium border border-purple-100 bg-purple-50 px-2 py-1 rounded-full">
                  {template.tone}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">"{template.headline}"</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-4">{template.body}</p>
              
              {/* Placeholder Image Area */}
              <div className="relative h-32 w-full bg-slate-100 rounded-lg overflow-hidden">
                 <img 
                    src={`https://picsum.photos/seed/${template.suggestedImageQuery + template.id}/400/200`} 
                    alt="Suggested"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="bg-brand-purple/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                     Tap to Edit
                   </span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
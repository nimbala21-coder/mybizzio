
import React from 'react';
import { ViewState } from '../types';
import { IconHome, IconBarChart, IconMegaphone, IconPlus } from './Icons';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const isHidden = [ViewState.PROCESSING, ViewState.MIXER, ViewState.SUCCESS, ViewState.PROFILE, ViewState.FORMAT_PICKER].includes(currentView);

  if (isHidden) return null;

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view || (view === ViewState.GUIDED_CREATION && currentView === ViewState.GUIDED_CREATION);
    return (
      <button
        onClick={() => setView(view)}
        className={`flex flex-col items-center gap-1.5 transition-all duration-200 
          ${isActive ? 'text-brand-purple translate-y-[-2px]' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : ''}`} />
        <span className="text-[10px] font-bold tracking-wide uppercase">{label}</span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white px-8 py-3 flex justify-between items-center z-50 safe-area-pb border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <NavItem view={ViewState.HOME} icon={IconHome} label="Home" />
      <NavItem view={ViewState.GUIDED_CREATION} icon={IconPlus} label="Create" />
      <NavItem view={ViewState.ADS} icon={IconMegaphone} label="Promote" />
      <NavItem view={ViewState.MANAGE} icon={IconBarChart} label="Manage" />
    </div>
  );
};

export default Navbar;


import React from 'react';
import { IconUser, IconLink, IconCreditCard, IconArrowLeft, IconInstagram, IconFacebook, IconTikTok } from './Icons';
import { ViewState } from '../types';

interface ProfileProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ businessName, setBusinessName, onBack }) => {
  const ConnectedAccountRow = ({ icon: Icon, name, connected }: { icon: any, name: string, connected: boolean }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>
        <span className="font-medium text-slate-900">{name}</span>
      </div>
      <button className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${connected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
        {connected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );

  return (
    <div className="bg-white h-full overflow-y-auto animate-slide-up">
      {/* Header */}
      <div className="px-6 py-6 border-b border-slate-100 flex items-center gap-4 sticky top-0 bg-white z-20">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
          <IconArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
            {businessName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Name</label>
            <input 
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full text-xl font-bold text-slate-900 border-b border-slate-200 focus:border-brand-purple focus:outline-none py-1 bg-transparent"
            />
            <p className="text-slate-500 text-sm mt-1">admin@bizzio.ai</p>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-2">
            <IconLink className="w-5 h-5 text-brand-orange" />
            <h3>Social Connections</h3>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4">
            <ConnectedAccountRow icon={IconInstagram} name="Instagram" connected={true} />
            <ConnectedAccountRow icon={IconFacebook} name="Facebook Page" connected={true} />
            <ConnectedAccountRow icon={IconTikTok} name="TikTok Business" connected={false} />
          </div>
        </div>

        {/* Billing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-2">
            <IconCreditCard className="w-5 h-5 text-brand-purple" />
            <h3>Billing & Plan</h3>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Current Plan</p>
                 <h4 className="text-xl font-bold">Pro Business</h4>
               </div>
               <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded">ACTIVE</span>
            </div>
            <p className="text-sm text-slate-300 mb-4">Next billing date: <span className="text-white font-bold">Nov 24, 2024</span></p>
            <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-medium transition-colors">
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Misc */}
         <div className="pt-4">
           <button className="w-full py-3 text-red-500 font-medium text-sm bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
             Sign Out
           </button>
           <p className="text-center text-[10px] text-slate-400 mt-4">Version 1.0.0 (MVP)</p>
         </div>

      </div>
    </div>
  );
};

export default Profile;

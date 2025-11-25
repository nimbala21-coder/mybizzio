import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { IconInstagram, IconTikTok, IconFacebook } from './Icons';

const data = [
  { name: 'Mon', engagement: 4000, reach: 2400 },
  { name: 'Tue', engagement: 3000, reach: 1398 },
  { name: 'Wed', engagement: 2000, reach: 9800 },
  { name: 'Thu', engagement: 2780, reach: 3908 },
  { name: 'Fri', engagement: 1890, reach: 4800 },
  { name: 'Sat', engagement: 2390, reach: 3800 },
  { name: 'Sun', engagement: 3490, reach: 4300 },
];

const RecentPostCard = ({ platform, title, image, time, status }: { platform: 'insta' | 'tiktok' | 'fb', title: string, image: string, time: string, status: 'Published' | 'Scheduled' }) => (
  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm mb-3">
    <div className="h-14 w-14 rounded-lg overflow-hidden relative flex-shrink-0">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 right-0 bg-white p-0.5 rounded-tl">
         {platform === 'insta' && <IconInstagram className="w-3 h-3 text-pink-500" />}
         {platform === 'tiktok' && <IconTikTok className="w-3 h-3 text-black" />}
         {platform === 'fb' && <IconFacebook className="w-3 h-3 text-blue-600" />}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-slate-900 truncate">{title}</h4>
      <p className="text-xs text-slate-500">{time}</p>
    </div>
    <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
      {status}
    </div>
  </div>
);

const Manage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'History'>('Overview');

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in bg-slate-50 min-h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage</h1>
        <div className="flex bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('Overview')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'Overview' ? 'bg-brand-purple text-white shadow' : 'text-slate-500'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('History')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'History' ? 'bg-brand-purple text-white shadow' : 'text-slate-500'}`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'Overview' ? (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Total Reach</p>
              <p className="text-2xl font-bold text-slate-900">24.5k</p>
              <p className="text-xs text-green-500 font-medium mt-1">+12% this week</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Engagement</p>
              <p className="text-2xl font-bold text-slate-900">3.2k</p>
              <p className="text-xs text-green-500 font-medium mt-1">+5% this week</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4">Audience Growth</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5b21b6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#5b21b6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="reach" stroke="#5b21b6" fillOpacity={1} fill="url(#colorReach)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4">Top Platforms</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Insta', value: 85 },
                  { name: 'TikTok', value: 65 },
                  { name: 'FB', value: 40 }
                ]}>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                   <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px'}} />
                   <Bar dataKey="value" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 animate-slide-up">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Scheduled</h3>
           <RecentPostCard platform="tiktok" title="Summer Braids Tutorial" image="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&q=60" time="Tomorrow, 10:00 AM" status="Scheduled" />
           
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4">Published</h3>
           <RecentPostCard platform="insta" title="Glowing Skin Facial Promo" image="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=60" time="2h ago" status="Published" />
           <RecentPostCard platform="fb" title="Hydration Boost Serum" image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=60" time="2 days ago" status="Published" />
           <RecentPostCard platform="insta" title="Weekend Flash Sale" image="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=60" time="Last week" status="Published" />
        </div>
      )}
    </div>
  );
};

export default Manage;
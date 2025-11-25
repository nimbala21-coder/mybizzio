import React from 'react';
import { AdCampaign } from '../types';

const campaigns: AdCampaign[] = [
  { id: '1', name: 'Holiday Special Promo', status: 'Active', budget: 500, spent: 120, impressions: 15000, clicks: 450 },
  { id: '2', name: 'New Client Offer', status: 'Paused', budget: 200, spent: 190, impressions: 8000, clicks: 120 },
  { id: '3', name: 'Product Launch', status: 'Draft', budget: 1000, spent: 0, impressions: 0, clicks: 0 },
];

const AdManager: React.FC = () => {
  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in bg-brand-light min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
        <button className="bg-brand-purple text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-purple-200 hover:bg-purple-800 transition-colors">
          + Create Ad
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium
                  ${campaign.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    campaign.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-slate-100 text-slate-600'}`}>
                  {campaign.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Spent</p>
                <p className="font-bold text-slate-900">${campaign.spent}</p>
              </div>
            </div>
            
            {campaign.status !== 'Draft' && (
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
                <div>
                  <p className="text-xs text-slate-500">Impressions</p>
                  <p className="font-medium text-slate-800">{campaign.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Clicks</p>
                  <p className="font-medium text-slate-800">{campaign.clicks.toLocaleString()}</p>
                </div>
              </div>
            )}
             {campaign.status === 'Draft' && (
              <div className="pt-3 border-t border-slate-50 text-xs text-slate-400">
                Configuration incomplete
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdManager;
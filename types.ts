
// Global Types

export enum ViewState {
  HOME = 'HOME',
  PROCESSING = 'PROCESSING',
  FORMAT_PICKER = 'FORMAT_PICKER', // New Step: Post vs Reel
  MIXER = 'MIXER',                 // New Step: The Creative Studio
  PREVIEW_FEED = 'PREVIEW_FEED',   // New Step: See it in context
  SUCCESS = 'SUCCESS',
  MANAGE = 'MANAGE',
  ADS = 'ADS',
  PROFILE = 'PROFILE',
  GUIDED_CREATION = 'GUIDED_CREATION',
}

export enum Platform {
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  TIKTOK = 'TikTok',
}

// New Data Structure for the Mixer
export interface MixerData {
  intent: string;
  format: 'Post' | 'Reel' | 'Story';
  visuals: {
    id: string;
    prompt: string;
    url: string;
  }[];
  captions: {
    id: string;
    text: string;
    tone: string;
  }[];
  isLoading?: boolean; // New flag for Optimistic UI
}

// State needed to reconstruct the design in the preview
export interface DesignState {
  filter: string;
  overlayText: string;
  overlayColor: string;
  overlayBg: string;
  textPos: { x: number, y: number };
  textSize: number;
  activeFrame: string | null; // Replaced activeSticker
  aspectRatio: string; // tailwind class
}

export interface FeedPreviewData {
  platform: Platform;
  image: string;
  caption: string;
  design: DesignState;
}

export interface AnalyticsMetric {
  name: string;
  value: number;
  change: number; // percentage
  positive: boolean;
}

export interface AdCampaign {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
}

export interface SocialPostTemplate {
  id: string;
  platform: Platform;
  tone: string;
  headline: string;
  body: string;
  suggestedImageQuery: string;
}

export interface GeneratedResponse {
  intent: string;
  templates: SocialPostTemplate[];
}

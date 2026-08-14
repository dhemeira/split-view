export const STORAGE_KEY = 'split-view:lastUrl';
export const HISTORY_KEY = 'split-view:history';
export const MAX_HISTORY = 3;

export const MIN_VIEW_WIDTH = 220;
export const MIN_VIEW_HEIGHT = 220;
export const MAX_VIEW_WIDTH = 4000;

export interface ViewPreset {
  label: string;
  width: number;
  height: number;
  resizable?: boolean;
}

export interface View extends ViewPreset {
  id: string;
  inst?: number;
}

export const VIEW_PRESETS: ViewPreset[] = [
  { label: 'Phone SE', width: 375, height: 667 },
  { label: 'iPhone 15 Pro Max', width: 430, height: 932 },
  { label: 'iPad', width: 768, height: 1024 },
  { label: 'Desktop HD', width: 1920, height: 1080 },
  { label: 'Custom', width: 800, height: 600, resizable: true },
];

export const DEFAULT_VIEWS: View[] = [
  { id: 'phone', label: 'iPhone 15 Pro Max', width: 430, height: 932 },
  { id: 'desktop', label: 'Desktop HD', width: 1920, height: 1080 },
  { id: 'custom', label: 'Custom', width: 800, height: 600, resizable: true },
];
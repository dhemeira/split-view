export const STORAGE_KEY = 'split-view:lastUrl';
export const HISTORY_KEY = 'split-view:history';
export const MAX_HISTORY = 3;

export const MIN_VIEW_WIDTH = 220;
export const MIN_VIEW_HEIGHT = 220;
export const MAX_VIEW_WIDTH = 4000;

export const MIN_ZOOM = 50;
export const MAX_ZOOM = 150;
export const DEFAULT_ZOOM = 100;

export const MIN_FRAME_WIDTH = 250;
export const SCROLLBAR_GUTTER = 8;

export interface ViewPreset {
  label: string;
  width: number;
  height: number;
  resizable?: boolean;
}

export interface View extends ViewPreset {
  id: string;
  inst?: number;
  fit: boolean;
  zoom: number;
}

export const VIEW_PRESETS: ViewPreset[] = [
  { label: 'iPhone 5', width: 320, height: 568 },
  { label: 'iPhone 15 Pro Max', width: 430, height: 932 },
  { label: 'iPad Air 2020', width: 820, height: 1180 },
  { label: 'Laptop', width: 1440, height: 900 },
  { label: 'Desktop HD', width: 1920, height: 1080 },
  { label: 'Responsive', width: 500, height: 500, resizable: true },
];

export const DEFAULT_VIEWS: View[] = [
  { id: 'phone', label: 'iPhone 15 Pro Max', width: 430, height: 932, fit: true, zoom: DEFAULT_ZOOM },
  { id: 'laptop', label: 'Laptop', width: 1440, height: 900, fit: true, zoom: DEFAULT_ZOOM },
];
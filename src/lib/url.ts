import { HISTORY_KEY, MAX_HISTORY } from '../constants';

export function normalizeUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return '';
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) return 'http://' + url;
  return url;
}

export function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === 'string') : [];
  } catch {
    return [];
  }
}

export function pushHistory(url: string): string[] {
  const next = [url, ...loadHistory().filter((u) => u !== url)].slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  return next;
}

export function deleteHistory(url: string): string[] {
  const next = loadHistory().filter((u) => u !== url);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  return next;
}
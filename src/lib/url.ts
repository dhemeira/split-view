export function normalizeUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return '';
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) return 'http://' + url;
  return url;
}
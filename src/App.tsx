import { useCallback, useEffect, useState } from 'react';
import { DesktopView } from './components/DesktopView';
import { MobileView } from './components/MobileView';
import { UrlBar } from './components/UrlBar';
import { STORAGE_KEY } from './constants';
import { loadHistory, normalizeUrl, pushHistory } from './lib/url';

const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export default function App() {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [frameKey, setFrameKey] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUrl(saved);
      setInput(saved);
    }
    setHistory(loadHistory());
  }, []);

  const load = useCallback((next: string) => {
    if (!next) return;
    setUrl(next);
    setInput(next);
    setFrameKey((k) => k + 1);
    localStorage.setItem(STORAGE_KEY, next);
    setHistory(pushHistory(next));
  }, []);

  const submit = useCallback(() => {
    const next = normalizeUrl(input);
    if (!next) return;
    load(next);
  }, [input, load]);

  const reload = useCallback(() => {
    if (url) setFrameKey((k) => k + 1);
  }, [url]);

  const openDevtools = useCallback(() => {
    if (!isTauri()) return;
    import('@tauri-apps/api/core').then(({ invoke }) => invoke('open_devtools'));
  }, []);

  return (
    <>
      <UrlBar
        value={input}
        canReload={Boolean(url)}
        showDevtools={isTauri()}
        history={history}
        onChange={setInput}
        onSubmit={submit}
        onReload={reload}
        onOpenDevtools={openDevtools}
        onSelectHistory={load}
      />
      <main className="content">
        <MobileView url={url} frameKey={frameKey} />
        <DesktopView url={url} frameKey={frameKey} />
      </main>
    </>
  );
}
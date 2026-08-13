import { useCallback, useEffect, useState } from 'react';
import { DesktopView } from './components/DesktopView';
import { MobileView } from './components/MobileView';
import { UrlBar } from './components/UrlBar';
import { STORAGE_KEY } from './constants';
import { normalizeUrl } from './lib/url';

export default function App() {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [frameKey, setFrameKey] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUrl(saved);
      setInput(saved);
    }
  }, []);

  const submit = useCallback(() => {
    const next = normalizeUrl(input);
    if (!next) return;
    setUrl(next);
    setFrameKey((k) => k + 1);
    localStorage.setItem(STORAGE_KEY, next);
  }, [input]);

  const reload = useCallback(() => {
    if (url) setFrameKey((k) => k + 1);
  }, [url]);

  return (
    <>
      <UrlBar
        value={input}
        canReload={Boolean(url)}
        onChange={setInput}
        onSubmit={submit}
        onReload={reload}
      />
      <main className="content">
        <MobileView url={url} frameKey={frameKey} />
        <DesktopView url={url} frameKey={frameKey} />
      </main>
    </>
  );
}
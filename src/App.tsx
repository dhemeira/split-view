import { useCallback, useEffect, useState } from 'react';
import { Stage } from './components/Stage';
import { UrlBar } from './components/UrlBar';
import {
  DEFAULT_VIEWS,
  DEFAULT_ZOOM,
  STORAGE_KEY,
  VIEW_PRESETS,
  type View,
  type ViewPreset,
} from './constants';
import { deleteHistory, loadHistory, normalizeUrl, pushHistory } from './lib/url';

const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

const uid = () => Math.random().toString(36).slice(2, 9);

export default function App() {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [frameKey, setFrameKey] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [views, setViews] = useState<View[]>(DEFAULT_VIEWS);
  const [scroll, setScroll] = useState({ pos: 0, ratio: 0 });

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

  const addView = useCallback((preset: ViewPreset) => {
    setViews((v) => [...v, { ...preset, id: uid(), inst: 0, fit: true, zoom: DEFAULT_ZOOM }]);
  }, []);

  const updateView = useCallback((id: string, patch: Partial<View>) => {
    setViews((v) => v.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const moveView = useCallback((id: string, direction: -1 | 1) => {
    setViews((v) => {
      const i = v.findIndex((x) => x.id === id);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= v.length) return v;
      const next = v.map((x) =>
        x.id === v[i].id || x.id === v[j].id ? { ...x, inst: (x.inst ?? 0) + 1 } : x,
      );
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  const removeView = useCallback((id: string) => {
    setViews((v) => v.filter((x) => x.id !== id));
  }, []);

  const resizeView = useCallback((id: string, width: number, height: number) => {
    setViews((v) => v.map((x) => (x.id === id ? { ...x, width, height } : x)));
  }, []);

  const removeHistory = useCallback((next: string) => {
    setHistory(deleteHistory(next));
  }, []);

  return (
    <>
      <UrlBar
        value={input}
        canReload={Boolean(url)}
        showDevtools={isTauri()}
        history={history}
        presets={VIEW_PRESETS}
        scroll={{ pos: scroll.pos, ratio: scroll.ratio }}
        onChange={setInput}
        onSubmit={submit}
        onReload={reload}
        onOpenDevtools={openDevtools}
        onSelectHistory={load}
        onAddView={addView}
        onDeleteHistory={removeHistory}
      />
      <main className="stage-area">
        <Stage
          views={views}
          url={url}
          frameKey={frameKey}
          onScroll={setScroll}
          onMove={moveView}
          onRemove={removeView}
          onResize={resizeView}
          onUpdate={updateView}
        />
      </main>
    </>
  );
}
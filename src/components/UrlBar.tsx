import { ArrowPathIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

interface UrlBarProps {
  value: string;
  canReload: boolean;
  showDevtools: boolean;
  history: string[];
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReload: () => void;
  onOpenDevtools: () => void;
  onSelectHistory: (url: string) => void;
}

export function UrlBar({
  value,
  canReload,
  showDevtools,
  history,
  onChange,
  onSubmit,
  onReload,
  onOpenDevtools,
  onSelectHistory,
}: UrlBarProps) {
  return (
    <header className="urlbar">
      <span className="brand">SplitView</span>
      {history.length > 0 && (
        <select
          className="history"
          aria-label="Recent URLs"
          value=""
          onChange={(e) => e.target.value && onSelectHistory(e.target.value)}
        >
          <option value="" disabled>
            History
          </option>
          {history.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      )}
      <input
        type="text"
        value={value}
        placeholder="Paste a URL and press Enter (e.g. http://localhost:5000)"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
      {showDevtools && (
        <button
          className="ghost"
          onClick={onOpenDevtools}
          title="Open DevTools"
          aria-label="Open DevTools"
        >
          <WrenchScrewdriverIcon />
        </button>
      )}
      <button onClick={onReload} disabled={!canReload} title="Reload current URL" aria-label="Reload">
        <ArrowPathIcon />
      </button>
    </header>
  );
}
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface UrlBarProps {
  value: string;
  canReload: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReload: () => void;
}

export function UrlBar({ value, canReload, onChange, onSubmit, onReload }: UrlBarProps) {
  return (
    <header className="urlbar">
      <span className="brand">SplitView</span>
      <input
        type="text"
        value={value}
        placeholder="Paste a URL and press Enter (e.g. http://localhost:5173)"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
      <button onClick={onReload} disabled={!canReload} title="Reload current URL" aria-label="Reload">
        <ArrowPathIcon />
      </button>
    </header>
  );
}
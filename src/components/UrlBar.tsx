import { ArrowPathIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import type { ViewPreset } from '../constants';
import type { StageScroll } from './Stage';
import { Dropdown, type DropdownOption } from './Dropdown';

interface UrlBarProps {
  value: string;
  canReload: boolean;
  showDevtools: boolean;
  history: string[];
  presets: ViewPreset[];
  scroll: StageScroll;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReload: () => void;
  onOpenDevtools: () => void;
  onSelectHistory: (url: string) => void;
  onAddView: (preset: ViewPreset) => void;
}

export function UrlBar({
  value,
  canReload,
  showDevtools,
  history,
  presets,
  scroll,
  onChange,
  onSubmit,
  onReload,
  onOpenDevtools,
  onSelectHistory,
  onAddView,
}: UrlBarProps) {
  const addOptions: DropdownOption[] = presets.map((p) => ({
    value: p.label,
    label: `${p.label} (${p.width}\u00d7${p.height})`,
  }));
  const historyOptions: DropdownOption[] = history.map((u) => ({ value: u, label: u }));

  return (
    <header className="urlbar">
      <span className="brand">SplitView</span>
      <Dropdown
        label="+ Add view"
        ariaLabel="Add view"
        options={addOptions}
        onSelect={(label) => {
          const preset = presets.find((p) => p.label === label);
          if (preset) onAddView(preset);
        }}
      />
      {history.length > 0 && (
        <Dropdown label="History" ariaLabel="Recent URLs" options={historyOptions} onSelect={onSelectHistory} />
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
      <div className="scrollbar" aria-hidden="true">
        <div
          className="scrollbar-thumb"
          style={{
            width: `${scroll.ratio * 100}%`,
            left: `calc(${scroll.pos} * (100% - ${scroll.ratio * 100}%))`,
          }}
        />
      </div>
    </header>
  );
}
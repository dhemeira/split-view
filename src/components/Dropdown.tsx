import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';

export interface DropdownOption {
  value: string;
  label: string;
  onDelete?: (value: string) => void;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  ariaLabel: string;
  onSelect: (value: string) => void;
}

export function Dropdown({ label, options, ariaLabel, onSelect }: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current;
    const btn = btnRef.current;
    if (!menu || !btn) return;

    const position = () => {
      const r = btn.getBoundingClientRect();
      const s = menu.style;
      s.position = 'fixed';
      s.inset = 'auto';
      s.top = `${Math.round(r.bottom + 4)}px`;
      s.left = `${Math.round(r.left)}px`;
      s.minWidth = `${Math.round(r.width)}px`;
    };

    const onToggle = () => {
      const isOpen = menu.matches(':popover-open');
      if (isOpen) position();
      setOpen(isOpen);
    };
    menu.addEventListener('toggle', onToggle);
    const onResize = () => {
      if (menu.matches(':popover-open')) position();
    };
    window.addEventListener('resize', onResize);
    return () => {
      menu.removeEventListener('toggle', onToggle);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const select = (value: string) => {
    menuRef.current?.hidePopover();
    onSelect(value);
  };

  return (
    <div className="dropdown">
      <button
        ref={btnRef}
        type="button"
        className="dd-toggle"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        popoverTarget={id}
      >
        <span className="dd-label">{label}</span>
        <ChevronDownIcon className={open ? 'dd-chevron dd-chevron-open' : 'dd-chevron'} />
      </button>
      <div ref={menuRef} id={id} popover="auto" role="menu" className="dd-menu">
        {options.map((o) => (
          <div key={o.value} className="dd-item">
            <button type="button" role="menuitem" onClick={() => select(o.value)}>
              {o.label}
            </button>
            {o.onDelete && (
              <button
                type="button"
                className="dd-item-delete"
                aria-label={`Delete ${o.label}`}
                title="Remove from history"
                onClick={() => o.onDelete?.(o.value)}
              >
                <XMarkIcon />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
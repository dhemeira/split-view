import { useEffect, useRef, useState } from 'react';

const MIN_SCALE = 0.02;
const MAX_SCALE = 4;

export function useFitScale<T extends HTMLElement>(
  targetHeight: number,
  padding = 0,
): { containerRef: React.RefObject<T | null>; scale: number } {
  const containerRef = useRef<T>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const available = el.clientHeight - padding;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, available / targetHeight));
      setScale(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetHeight, padding]);

  return { containerRef, scale };
}
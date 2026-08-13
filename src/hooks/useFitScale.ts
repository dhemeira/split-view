import { useEffect, useRef, useState } from 'react';
import { MAX_SCALE, MIN_SCALE } from '../constants';

export function useFitScale<T extends HTMLElement>(
  targetHeight: number,
  padding = 0,
): { containerRef: React.RefObject<T | null>; scale: number } {
  const containerRef = useRef<T>(null);
  const [scale, setScale] = useState(MAX_SCALE);

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
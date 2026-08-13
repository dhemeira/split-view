import { useFitScale } from '../hooks/useFitScale';
import { PHONE_HEIGHT, PHONE_PADDING, PHONE_WIDTH } from '../constants';
import { EmptyState } from './EmptyState';

interface MobileViewProps {
  url: string;
  frameKey: number;
}

export function MobileView({ url, frameKey }: MobileViewProps) {
  const { containerRef, scale } = useFitScale<HTMLDivElement>(PHONE_HEIGHT, PHONE_PADDING * 2);
  const panelWidth = Math.ceil(PHONE_WIDTH * scale + PHONE_PADDING * 2);

  return (
    <section className="left" style={{ width: panelWidth }}>
      <div className="label">Mobile</div>
      <div className="phone-area" ref={containerRef}>
        <div className="phone" style={{ zoom: scale }}>
          {url ? (
            <iframe key={`mobile-${frameKey}`} src={url} title="Mobile view" />
          ) : (
            <EmptyState message="Enter a URL above" />
          )}
        </div>
      </div>
    </section>
  );
}
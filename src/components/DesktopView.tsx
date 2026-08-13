import { EmptyState } from './EmptyState';

interface DesktopViewProps {
  url: string;
  frameKey: number;
}

export function DesktopView({ url, frameKey }: DesktopViewProps) {
  return (
    <section className="right">
      <div className="label">Desktop</div>
      {url ? (
        <iframe key={`desktop-${frameKey}`} src={url} title="Desktop view" />
      ) : (
        <EmptyState message="Enter a URL above" />
      )}
    </section>
  );
}
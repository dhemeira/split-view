import { useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  MIN_VIEW_HEIGHT,
  MIN_VIEW_WIDTH,
  MAX_VIEW_WIDTH,
  MIN_FRAME_WIDTH,
  SCROLLBAR_GUTTER,
  type View,
} from '../constants';
import { useFitScale } from '../hooks/useFitScale';
import { EmptyState } from './EmptyState';

interface DeviceViewProps {
  view: View;
  url: string;
  frameKey: number;
  isFirst: boolean;
  isLast: boolean;
  onLabelDragStart: (e: React.PointerEvent) => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRemove: () => void;
  onResize: (width: number, height: number) => void;
  onUpdate: (patch: Partial<View>) => void;
}

const LABEL_HEIGHT = 26;
const TOOLS_HEIGHT = 22;
const WRAP_PADDING = 8;
const FIT_BORDER_ALLOWANCE = 2;

type ResizeDir = 'w' | 'h' | 'both';

export function DeviceView({
  view,
  url,
  frameKey,
  isFirst,
  isLast,
  onLabelDragStart,
  onMoveLeft,
  onMoveRight,
  onRemove,
  onResize,
  onUpdate,
}: DeviceViewProps) {
  const { containerRef, scale } = useFitScale<HTMLDivElement>(
    view.height,
    LABEL_HEIGHT + TOOLS_HEIGHT + WRAP_PADDING + FIT_BORDER_ALLOWANCE,
  );
  const { fit, zoom } = view;
  const displayScale = fit
    ? view.resizable
      ? 1
      : scale
    : Math.max(zoom / 100, MIN_FRAME_WIDTH / view.width);

  const maxViewHeight = () => {
    const el = containerRef.current;
    if (!el) return 2000;
    return Math.max(
      MIN_VIEW_HEIGHT,
      el.clientHeight - LABEL_HEIGHT - TOOLS_HEIGHT - WRAP_PADDING - FIT_BORDER_ALLOWANCE,
    );
  };

  const resizeRef = useRef<{
    startX: number;
    startY: number;
    width: number;
    height: number;
    dir: ResizeDir;
  } | null>(null);

  const startResize = (dir: ResizeDir) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, width: view.width, height: view.height, dir };
  };

  const onResizeMove = (e: React.PointerEvent) => {
    const r = resizeRef.current;
    if (!r) return;
    const dw = Math.round((e.clientX - r.startX) / displayScale);
    const dh = Math.round((e.clientY - r.startY) / displayScale);
    let w = r.width;
    let h = r.height;
    if (r.dir === 'w' || r.dir === 'both') w = Math.min(MAX_VIEW_WIDTH, Math.max(MIN_VIEW_WIDTH, r.width + dw));
    if (r.dir === 'h' || r.dir === 'both') h = Math.min(maxViewHeight(), Math.max(MIN_VIEW_HEIGHT, r.height + dh));
    onResize(w, h);
  };

  const endResize = () => {
    resizeRef.current = null;
  };

  const instance = `${view.id}-${frameKey}-${view.inst ?? 0}`;

  const frameWidth = Math.round(view.width * displayScale) + 2;
  const deviceWidth = frameWidth + SCROLLBAR_GUTTER * 2;

  return (
    <div className="device" ref={containerRef} style={{ width: `${deviceWidth}px` }}>
      <div className="device-label" onPointerDown={onLabelDragStart}>
        <span className="device-name" title={view.label}>
          {view.label}
        </span>
        <span className="device-dims">
          {view.width}&times;{view.height}
        </span>
        <span className="device-controls">
          <button
            className="devbtn"
            onClick={onMoveLeft}
            disabled={isFirst}
            title="Move left"
            aria-label="Move left"
          >
            <ArrowLeftIcon />
          </button>
          <button
            className="devbtn"
            onClick={onMoveRight}
            disabled={isLast}
            title="Move right"
            aria-label="Move right"
          >
            <ArrowRightIcon />
          </button>
          <button className="devbtn close" onClick={onRemove} title="Remove view" aria-label="Remove view">
            <XMarkIcon />
          </button>
        </span>
      </div>
      <div className="device-tools" onPointerDown={onLabelDragStart}>
        <label className="fit-toggle" title="Fit to screen height">
          <input
            type="checkbox"
            checked={fit}
            onChange={() => onUpdate({ fit: !fit })}
            aria-label="Fit to height"
          />
          <span className="switch-track" />
        </label>
        <input
          type="range"
          className="zoom-slider"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={10}
          value={zoom}
          disabled={fit}
          onChange={(e) => onUpdate({ zoom: Number(e.target.value) })}
          aria-label="Zoom level"
        />
        <span className="zoom-pct">{Math.round(displayScale * 100)}%</span>
      </div>
      <div className="frame-wrap">
        <div className="frame" style={{ width: view.width, height: view.height, zoom: displayScale }}>
          {url ? (
            <iframe key={instance} src={url} title={view.label} />
          ) : (
            <EmptyState message="Enter a URL above" />
          )}
        </div>
        {view.resizable && (
          <>
            <div
              className="resize-edge resize-right"
              onPointerDown={startResize('w')}
              onPointerMove={onResizeMove}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              title="Drag to resize width"
            />
            <div
              className="resize-edge resize-bottom"
              onPointerDown={startResize('h')}
              onPointerMove={onResizeMove}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              title="Drag to resize height"
            />
            <div
              className="resize-corner"
              onPointerDown={startResize('both')}
              onPointerMove={onResizeMove}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              title="Drag to resize"
            />
          </>
        )}
      </div>
    </div>
  );
}
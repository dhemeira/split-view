import { useEffect, useRef } from 'react';
import type { View } from '../constants';
import { DeviceView } from './DeviceView';

export interface StageScroll {
  pos: number;
  ratio: number;
}

interface StageProps {
  views: View[];
  url: string;
  frameKey: number;
  onScroll: (scroll: StageScroll) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onUpdate: (id: string, patch: Partial<View>) => void;
}

export function Stage({
  views,
  url,
  frameKey,
  onScroll,
  onMove,
  onRemove,
  onResize,
  onUpdate,
}: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);

  const reportScroll = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const max = Math.max(1, stage.scrollWidth - stage.clientWidth);
    onScroll({ pos: stage.scrollLeft / max, ratio: stage.clientWidth / stage.scrollWidth });
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(reportScroll);
    observer.observe(stage);
    reportScroll();
    return () => observer.disconnect();
  }, [views.length]);

  const onLabelDragStart = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('button')) return;
    if (t.closest('.fit-toggle') || t.closest('.zoom-slider')) return;
    const stage = stageRef.current;
    if (!stage) return;
    dragRef.current = { startX: e.clientX, startScroll: stage.scrollLeft };
    stage.classList.add('panning');
    stage.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onLabelDragMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const stage = stageRef.current;
    if (!drag || !stage) return;
    stage.scrollLeft = drag.startScroll - (e.clientX - drag.startX);
    reportScroll();
  };

  const onLabelDragEnd = () => {
    dragRef.current = null;
    stageRef.current?.classList.remove('panning');
  };

  return (
    <div
      className="stage"
      ref={stageRef}
      onScroll={reportScroll}
      onPointerMove={onLabelDragMove}
      onPointerUp={onLabelDragEnd}
      onPointerCancel={onLabelDragEnd}
    >
      {views.map((view, i) => (
        <DeviceView
          key={view.id}
          view={view}
          url={url}
          frameKey={frameKey}
          isFirst={i === 0}
          isLast={i === views.length - 1}
          onLabelDragStart={onLabelDragStart}
          onMoveLeft={() => onMove(view.id, -1)}
          onMoveRight={() => onMove(view.id, 1)}
          onRemove={() => onRemove(view.id)}
          onResize={(w, h) => onResize(view.id, w, h)}
          onUpdate={(patch) => onUpdate(view.id, patch)}
        />
      ))}
      {views.length === 0 && <div className="empty-stage">No views — add one from the menu</div>}
    </div>
  );
}
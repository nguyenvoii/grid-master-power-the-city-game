import React from 'react';
import { GameEvent } from '../types';
import { CloudLightning, SunMedium, Zap, Sparkles, AlertOctagon, Wrench } from 'lucide-react';

interface EventBannerProps {
  events: GameEvent[];
  onEventAction?: (event: GameEvent) => void;
}

export const EventBanner: React.FC<EventBannerProps> = ({ events, onEventAction }) => {
  if (events.length === 0) return null;

  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'storm': return <CloudLightning className="w-4 h-4 text-sky-300 animate-bounce" />;
      case 'heatwave': return <SunMedium className="w-4 h-4 text-amber-300 animate-spin" />;
      case 'overload': return <Zap className="w-4 h-4 text-rose-300 animate-pulse" />;
      case 'festival': return <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />;
      case 'breaker_trip': return <AlertOctagon className="w-4 h-4 text-rose-400 animate-ping" />;
      default: return <Wrench className="w-4 h-4 text-cyan-300" />;
    }
  };

  return (
    <div id="event-banners-container" className="w-full space-y-2 mb-2">
      {events.map((evt) => {
        const progressPercent = Math.max(0, (evt.remainingSeconds / evt.durationSeconds) * 100);

        return (
          <div
            key={evt.id}
            className="relative overflow-hidden bg-slate-900/95 border border-amber-500/50 rounded-xl p-2.5 shadow-md flex items-center justify-between gap-3 text-xs"
          >
            {/* Top time progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center gap-2.5 mt-0.5">
              <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 shrink-0">
                {getEventIcon(evt.type)}
              </div>
              <div>
                <div className="font-bold text-amber-200 flex items-center gap-2">
                  <span>{evt.title}</span>
                  <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/40">
                    {Math.ceil(evt.remainingSeconds)}s
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5 max-w-md">
                  {evt.description}
                </p>
              </div>
            </div>

            {evt.requiresAction && evt.actionLabel && onEventAction && (
              <button
                id={`event-action-${evt.id}`}
                type="button"
                onClick={() => onEventAction(evt)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-lg shadow cursor-pointer whitespace-nowrap shrink-0"
              >
                {evt.actionLabel}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

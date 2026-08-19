import React, { useMemo } from 'react';
import { GameEvent } from '../types';

interface CityVisualizerProps {
  stabilityPercent: number; // 0 - 100
  isBreakerTripped: boolean;
  timeOfDay: number; // 0 - 1 (0: Dawn, 0.25: Noon, 0.5: Sunset, 0.75: Midnight)
  cityTierIndex: number;
  cityName: string;
  population: number;
  activeEvents: GameEvent[];
}

export const CityVisualizer: React.FC<CityVisualizerProps> = ({
  stabilityPercent,
  isBreakerTripped,
  timeOfDay,
  cityTierIndex,
  cityName,
  population,
  activeEvents
}) => {
  // Determine day/night visual parameters
  const isNight = timeOfDay > 0.55 || timeOfDay < 0.05;
  const isSunset = timeOfDay >= 0.4 && timeOfDay <= 0.55;
  const isDawn = timeOfDay >= 0.05 && timeOfDay <= 0.15;

  // Active weather events
  const isStorm = activeEvents.some(e => e.type === 'storm');
  const isFestival = activeEvents.some(e => e.type === 'festival');
  const isHeatwave = activeEvents.some(e => e.type === 'heatwave');

  // Power state
  const isBlackout = isBreakerTripped || stabilityPercent <= 5;
  const powerFactor = isBlackout ? 0 : Math.min(1, stabilityPercent / 100);

  // Background Sky style
  const skyGradient = useMemo(() => {
    if (isStorm) {
      return 'from-slate-800 via-slate-700 to-zinc-900';
    }
    if (isNight) {
      return 'from-slate-950 via-indigo-950 to-slate-900';
    }
    if (isSunset) {
      return 'from-amber-600 via-rose-500 to-indigo-900';
    }
    if (isDawn) {
      return 'from-amber-300 via-sky-400 to-indigo-600';
    }
    if (isHeatwave) {
      return 'from-amber-200 via-sky-300 to-sky-400';
    }
    return 'from-sky-300 via-sky-200 to-amber-50';
  }, [isStorm, isNight, isSunset, isDawn, isHeatwave]);

  // Generate buildings layout based on cityTierIndex
  const buildings = useMemo(() => {
    return [
      { id: 1, x: 20, w: 32, h: 48, floors: 3, windowsPerFloor: 2, type: 'house', color: '#475569' },
      { id: 2, x: 60, w: 42, h: 76, floors: 5, windowsPerFloor: 3, type: 'apt', color: '#334155' },
      { id: 3, x: 110, w: 36, h: 60, floors: 4, windowsPerFloor: 2, type: 'shop', color: '#475569' },
      { id: 4, x: 154, w: 48, h: 98, floors: 7, windowsPerFloor: 3, type: 'tower', color: '#1e293b' },
      { id: 5, x: 210, w: 40, h: 72, floors: 5, windowsPerFloor: 2, type: 'apt', color: '#334155' },
      { id: 6, x: 258, w: 56, h: 115, floors: 8, windowsPerFloor: 4, type: 'skyscraper', color: '#0f172a' },
      { id: 7, x: 322, w: 38, h: 54, floors: 3, windowsPerFloor: 2, type: 'house', color: '#475569' },
      { id: 8, x: 368, w: 50, h: 86, floors: 6, windowsPerFloor: 3, type: 'apt', color: '#334155' },
      { id: 9, x: 426, w: 44, h: 104, floors: 7, windowsPerFloor: 3, type: 'tower', color: '#1e293b' },
      { id: 10, x: 478, w: 34, h: 62, floors: 4, windowsPerFloor: 2, type: 'shop', color: '#475569' },
      { id: 11, x: 520, w: 58, h: 90, floors: 6, windowsPerFloor: 4, type: 'apt', color: '#334155' },
      { id: 12, x: 586, w: 38, h: 50, floors: 3, windowsPerFloor: 2, type: 'house', color: '#475569' }
    ];
  }, []);

  return (
    <div id="city-visualizer-container" className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg bg-slate-900 transition-colors duration-700">
      {/* Header bar of the city widget */}
      <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-none text-xs">
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-slate-200 shadow">
          <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: isBlackout ? '#ef4444' : powerFactor > 0.7 ? '#22c55e' : '#eab308' }} />
          <span className="font-semibold text-slate-100">{cityName}</span>
          <span className="text-slate-400">({population.toLocaleString()} dân)</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-slate-200 shadow">
          <span>{isNight ? '🌙 Đêm' : isSunset ? '🌇 Hoàng hôn' : isDawn ? '🌅 Bình minh' : '☀️ Ngày'}</span>
          <span className="text-slate-400">|</span>
          <span className={`font-medium ${isBlackout ? 'text-rose-400' : powerFactor > 0.7 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isBlackout ? 'MẤT ĐIỆN' : `${Math.round(stabilityPercent)}% Đủ Điện`}
          </span>
        </div>
      </div>

      {/* Sky Canvas SVG */}
      <div className={`w-full h-44 sm:h-52 bg-gradient-to-b ${skyGradient} relative overflow-hidden transition-all duration-1000`}>
        {/* Sun or Moon */}
        <div 
          className="absolute transition-all duration-1000"
          style={{
            top: isNight ? '18%' : '20%',
            left: `${((timeOfDay + 0.25) % 1) * 80 + 10}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {isNight ? (
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-100 shadow-[0_0_24px_rgba(254,243,199,0.5)] border border-amber-200/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-200/40 absolute top-2 left-2" />
                <div className="w-3 h-3 rounded-full bg-amber-200/30 absolute bottom-2 right-2" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className={`w-12 h-12 rounded-full ${isHeatwave ? 'bg-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.9)] animate-pulse' : 'bg-amber-300 shadow-[0_0_30px_rgba(252,211,77,0.7)]'}`} />
            </div>
          )}
        </div>

        {/* Stars at night */}
        {isNight && (
          <div className="absolute inset-0 pointer-events-none opacity-80">
            <span className="absolute top-4 left-1/6 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <span className="absolute top-8 left-1/3 w-1 h-1 bg-amber-100 rounded-full animate-pulse" />
            <span className="absolute top-6 left-2/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            <span className="absolute top-12 left-5/6 w-1.5 h-1.5 bg-sky-200 rounded-full" />
            <span className="absolute top-14 left-1/12 w-1 h-1 bg-white rounded-full opacity-60" />
            <span className="absolute top-10 left-1/2 w-1 h-1 bg-white rounded-full opacity-70" />
          </div>
        )}

        {/* Storm rain and lightning animation */}
        {isStorm && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 bg-sky-950/40" />
            <div className="absolute inset-0 animate-pulse bg-white/20" style={{ animationDuration: '1.2s' }} />
            <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(105deg,transparent,transparent_8px,rgba(255,255,255,0.4)_9px,transparent_10px)]" />
          </div>
        )}

        {/* Festival lanterns / confetti effect */}
        {isFestival && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div className="absolute top-2 left-1/4 animate-bounce text-sm">🏮</div>
            <div className="absolute top-4 left-1/2 animate-bounce text-sm" style={{ animationDelay: '0.3s' }}>🏮</div>
            <div className="absolute top-3 left-3/4 animate-bounce text-sm" style={{ animationDelay: '0.6s' }}>🏮</div>
            <div className="absolute top-8 left-1/6 animate-pulse text-xs">✨</div>
            <div className="absolute top-7 left-5/6 animate-pulse text-xs">✨</div>
          </div>
        )}

        {/* Distant Hills / Mountains silhouette */}
        <svg className="absolute bottom-16 left-0 w-full h-20 text-slate-800/40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 600 80">
          <path d="M0,80 L0,45 Q70,20 150,50 T320,30 T480,55 T600,40 L600,80 Z" fill="currentColor" />
          <path d="M0,80 L0,58 Q120,40 240,65 T450,45 T600,60 L600,80 Z" fill="#1e293b" opacity="0.6" />
        </svg>

        {/* Power Transmission Lines connecting Station (Left) to City (Right) */}
        <svg className="absolute bottom-14 left-0 w-full h-28 pointer-events-none z-10" viewBox="0 0 640 100" preserveAspectRatio="none">
          {/* Left Substation Tower */}
          <g transform="translate(10, 20)">
            <line x1="12" y1="75" x2="12" y2="10" stroke="#64748b" strokeWidth="2.5" />
            <line x1="2" y1="75" x2="22" y2="75" stroke="#64748b" strokeWidth="2" />
            <line x1="4" y1="30" x2="20" y2="30" stroke="#64748b" strokeWidth="2" />
            <line x1="1" y1="50" x2="23" y2="50" stroke="#64748b" strokeWidth="2" />
            <line x1="2" y1="75" x2="12" y2="10" stroke="#64748b" strokeWidth="1" />
            <line x1="22" y1="75" x2="12" y2="10" stroke="#64748b" strokeWidth="1" />
            <circle cx="12" cy="8" r="2.5" fill={isBlackout ? '#ef4444' : '#22c55e'} className="animate-ping" />
            <circle cx="12" cy="8" r="2" fill={isBlackout ? '#ef4444' : '#22c55e'} />
          </g>

          {/* Electric Cables */}
          <path 
            d="M22,30 Q160,50 300,38 T620,42" 
            fill="none" 
            stroke={isBlackout ? '#475569' : '#38bdf8'} 
            strokeWidth={isBlackout ? 1 : 1.75}
            strokeDasharray={isBlackout ? '4,4' : 'none'}
            opacity={isBlackout ? 0.4 : 0.85}
          />
          <path 
            d="M22,50 Q170,72 320,60 T620,62" 
            fill="none" 
            stroke={isBlackout ? '#475569' : '#60a5fa'} 
            strokeWidth={isBlackout ? 1 : 1.5}
            strokeDasharray={isBlackout ? '4,4' : 'none'}
            opacity={isBlackout ? 0.3 : 0.75}
          />

          {!isBlackout && (
            <circle r="2.5" fill="#fef08a" className="animate-pulse">
              <animateMotion 
                path="M22,30 Q160,50 300,38 T620,42" 
                dur="1.8s" 
                repeatCount="indefinite" 
              />
            </circle>
          )}
        </svg>

        {/* Buildings Skyline */}
        <div className="absolute bottom-4 left-0 w-full h-32 px-1 flex items-end justify-between z-10">
          <svg className="w-full h-full" viewBox="0 0 640 130" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {buildings.map((b) => {
              const buildingY = 120 - b.h;
              const totalWindows = b.floors * b.windowsPerFloor;
              const litWindowCount = Math.round(totalWindows * powerFactor * (isNight ? 0.95 : 0.6));

              return (
                <g key={b.id}>
                  <rect
                    x={b.x}
                    y={buildingY}
                    width={b.w}
                    height={b.h}
                    fill={b.color}
                    rx="2"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />

                  {(b.type === 'tower' || b.type === 'skyscraper') && (
                    <g>
                      <line x1={b.x + b.w / 2} y1={buildingY} x2={b.x + b.w / 2} y2={buildingY - 14} stroke="#94a3b8" strokeWidth="1.5" />
                      <circle cx={b.x + b.w / 2} cy={buildingY - 14} r="1.5" fill={isBlackout ? '#64748b' : '#ef4444'} />
                    </g>
                  )}

                  {b.type === 'house' && (
                    <polygon
                      points={`${b.x - 2},${buildingY} ${b.x + b.w / 2},${buildingY - 8} ${b.x + b.w + 2},${buildingY}`}
                      fill="#b91c1c"
                      opacity="0.8"
                    />
                  )}

                  {Array.from({ length: b.floors }).map((_, fIdx) => {
                    const floorY = buildingY + 6 + fIdx * (b.h / (b.floors + 0.8));
                    const winW = (b.w - (b.windowsPerFloor + 1) * 3) / b.windowsPerFloor;
                    const winH = 4;

                    return Array.from({ length: b.windowsPerFloor }).map((_, wIdx) => {
                      const winX = b.x + 3 + wIdx * (winW + 3);
                      const windowIndex = fIdx * b.windowsPerFloor + wIdx;
                      const isLit = windowIndex < litWindowCount;

                      return (
                        <rect
                          key={`win-${b.id}-${fIdx}-${wIdx}`}
                          x={winX}
                          y={floorY}
                          width={winW}
                          height={winH}
                          rx="0.5"
                          fill={isLit ? 'url(#windowGlow)' : '#0f172a'}
                          opacity={isLit ? 0.95 : 0.7}
                          filter={isLit && isNight ? 'url(#glowFilter)' : undefined}
                        />
                      );
                    });
                  })}
                </g>
              );
            })}

            {/* Road */}
            <rect x="0" y="118" width="640" height="12" fill="#0f172a" />
            <line x1="0" y1="118" x2="640" y2="118" stroke="#334155" strokeWidth="2" />

            {/* Street Lamps */}
            {[40, 140, 240, 350, 460, 560].map((lx, idx) => (
              <g key={`lamp-${idx}`} transform={`translate(${lx}, 100)`}>
                <line x1="0" y1="18" x2="0" y2="2" stroke="#64748b" strokeWidth="1.5" />
                <line x1="0" y1="2" x2="5" y2="2" stroke="#64748b" strokeWidth="1.5" />
                <circle cx="5" cy="3.5" r="1.5" fill={!isBlackout && (isNight || isSunset) ? '#fde047' : '#475569'} />
                {!isBlackout && (isNight || isSunset) && (
                  <polygon points="5,4 -4,18 14,18" fill="#fef08a" opacity="0.15" />
                )}
              </g>
            ))}

            {/* Moving little cars */}
            <g className="animate-[pulse_3s_ease-in-out_infinite]">
              <g transform="translate(180, 119)">
                <rect x="0" y="0" width="12" height="4" rx="1" fill="#ef4444" />
                <rect x="2" y="-2" width="7" height="3" rx="0.5" fill="#f87171" />
                <circle cx="12" cy="2" r="1" fill={!isBlackout ? '#fef08a' : '#475569'} />
                {!isBlackout && <polygon points="12,2 24,0 24,4" fill="#fef08a" opacity="0.25" />}
              </g>

              <g transform="translate(420, 122)">
                <rect x="0" y="0" width="12" height="4" rx="1" fill="#3b82f6" />
                <rect x="3" y="-2" width="7" height="3" rx="0.5" fill="#60a5fa" />
                <circle cx="0" cy="2" r="1" fill={!isBlackout ? '#fef08a' : '#475569'} />
                {!isBlackout && <polygon points="0,2 -12,0 -12,4" fill="#fef08a" opacity="0.25" />}
              </g>
            </g>
          </svg>
        </div>

        {/* Blackout Warning Overlay */}
        {isBlackout && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-3 z-30 animate-pulse">
            <div className="bg-rose-950/90 border border-rose-500/80 px-4 py-2 rounded-xl text-rose-200 shadow-2xl flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <div className="text-sm font-bold text-rose-100 uppercase tracking-wider">Thành Phố Mất Điện Toàn Phần!</div>
                <div className="text-xs text-rose-300">
                  {isBreakerTripped ? 'Cầu dao đã nhảy! Hãy gạt lại cầu dao và nhấn phát điện.' : 'Ắc quy cạn kiệt! Hãy nhấn nút tạo điện ngay!'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-950/90 px-3 py-1.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">Cấp thành phố: {cityTierIndex + 1}</span>
        <span className="flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Trạng thái: {isBlackout ? 'Mất điện' : stabilityPercent >= 90 ? 'Rất tốt' : stabilityPercent >= 50 ? 'Thiếu tải nhẹ' : 'Nguy cấp'}
        </span>
      </div>
    </div>
  );
};

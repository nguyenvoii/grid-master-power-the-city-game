import React, { useState, useRef, useCallback } from 'react';
import { Zap, RotateCcw, AlertTriangle, ShieldCheck, Power, Sparkles } from 'lucide-react';
import { formatPower, formatEnergy } from '../utils/formatters';
import { FloatingText, ParticleEffect } from '../types';

interface ControlPanelProps {
  clickPowerKw: number;
  isBreakerTripped: boolean;
  onManualClick: (x: number, y: number) => void;
  onResetBreaker: () => void;
  totalClickProducedKwh: number;
  clickUpgradeLevel: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  clickPowerKw,
  isBreakerTripped,
  onManualClick,
  onResetBreaker,
  totalClickProducedKwh,
  clickUpgradeLevel
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);
  const textIdCounter = useRef(1);

  // Trigger generator click action
  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const relX = clientX ? clientX - rect.left : rect.width / 2;
      const relY = clientY ? clientY - rect.top : rect.height / 2;

      // Add floating text
      const newTextId = textIdCounter.current++;
      const textVal = `+${formatPower(clickPowerKw)}`;
      setFloatingTexts(prev => [
        ...prev.slice(-6),
        { id: newTextId, text: textVal, x: relX, y: relY }
      ]);

      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => t.id !== newTextId));
      }, 900);

      // Add small electric spark particles
      const newParticles: ParticleEffect[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        newParticles.push({
          id: Math.random(),
          x: relX,
          y: relY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 3,
          color: Math.random() > 0.4 ? '#38bdf8' : '#fef08a',
          life: 1.0
        });
      }
      setParticles(prev => [...prev.slice(-15), ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.includes(p)));
      }, 500);
    }

    setRotationAngle(prev => (prev + 45) % 360);
    onManualClick(clientX, clientY);
  }, [clickPowerKw, onManualClick]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Circuit Breaker status & reset banner if tripped */}
      {isBreakerTripped ? (
        <div 
          id="breaker-trip-alert"
          className="w-full mb-3 p-3.5 bg-rose-950/80 border-2 border-rose-500 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse shadow-lg shadow-rose-950/50"
        >
          <div className="flex items-center gap-2.5 text-rose-200">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />
            <div>
              <span className="font-bold text-rose-100 uppercase tracking-wide text-sm block">
                CẦU DAO TỰ ĐỘNG ĐÃ NHẢY!
              </span>
              <span className="text-xs text-rose-300">
                Mạch điện bị ngắt an toàn. Nhấn nút để gạt lại!
              </span>
            </div>
          </div>
          <button
            id="reset-breaker-btn"
            onClick={onResetBreaker}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-300"
          >
            <Power className="w-4 h-4" />
            GẠT LẠI CẦU DAO
          </button>
        </div>
      ) : (
        <div className="w-full mb-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Cầu dao: ĐÓNG (Hoạt động)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Cấp quay tay: <span className="text-amber-400 font-semibold">Lv.{clickUpgradeLevel + 1}</span>
          </div>
        </div>
      )}

      {/* The Central Big Generator Button */}
      <div 
        ref={buttonRef}
        className="relative flex items-center justify-center my-1 select-none"
      >
        {/* Outer Glow Ring */}
        <div 
          className={`absolute -inset-3 rounded-full transition-all duration-300 pointer-events-none ${
            isPressing 
              ? 'bg-amber-400/30 blur-xl scale-110' 
              : 'bg-sky-500/15 blur-lg'
          }`} 
        />

        {/* Outer Ring */}
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-slate-700/80 bg-gradient-to-br from-slate-800 to-slate-950 p-2 shadow-2xl flex items-center justify-center relative">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-2 bg-slate-600 rounded-full"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-80px)`
              }}
            />
          ))}

          {/* Main Clickable Button */}
          <button
            id="generator-click-btn"
            type="button"
            onMouseDown={() => setIsPressing(true)}
            onMouseUp={() => setIsPressing(false)}
            onMouseLeave={() => setIsPressing(false)}
            onTouchStart={() => setIsPressing(true)}
            onTouchEnd={() => setIsPressing(false)}
            onClick={handleButtonClick}
            disabled={isBreakerTripped}
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-75 relative overflow-hidden shadow-inner touch-manipulation active:scale-95 ${
              isBreakerTripped 
                ? 'bg-slate-800 opacity-60 cursor-not-allowed border-2 border-slate-700'
                : isPressing
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 scale-95 border-2 border-amber-300'
                  : 'bg-gradient-to-b from-cyan-600 via-sky-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 border-2 border-cyan-300/60 shadow-[0_8px_25px_rgba(14,165,233,0.4)]'
            }`}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 transition-transform duration-200"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              <RotateCcw className="w-24 h-24 text-white stroke-[1.5]" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-2">
              <div className={`p-2 rounded-full mb-1 transition-transform ${isPressing ? 'scale-110 bg-amber-400/30' : 'bg-white/15'}`}>
                <Zap className={`w-7 h-7 sm:w-8 sm:h-8 fill-current ${isPressing ? 'text-amber-200 animate-pulse' : 'text-cyan-200'}`} />
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase drop-shadow">
                QUAY MÁY PHÁT
              </span>
              <span className="text-[10px] sm:text-xs text-cyan-100 font-mono font-medium drop-shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                +{formatPower(clickPowerKw)}/nhấn
              </span>
            </div>
          </button>
        </div>

        {/* Floating Sparks & Numbers */}
        {floatingTexts.map(item => (
          <div
            key={item.id}
            className="absolute pointer-events-none font-bold text-xs sm:text-sm text-amber-300 animate-float-fade font-mono z-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{
              left: `${item.x}px`,
              top: `${item.y - 15}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {item.text}
          </div>
        ))}

        {/* Spark Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none z-20"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`
            }}
          />
        ))}
      </div>

      <div className="mt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <span>Nhấn liên tục để nạp điện</span>
        <span className="text-slate-600">•</span>
        <span>Đã quay: <strong className="text-slate-200 font-mono">{formatEnergy(totalClickProducedKwh)}</strong></span>
      </div>
    </div>
  );
};

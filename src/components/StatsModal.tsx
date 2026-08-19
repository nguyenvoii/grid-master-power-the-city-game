import React from 'react';
import { X, Volume2, VolumeX, RotateCcw, Award, Zap, Coins, Clock, AlertTriangle } from 'lucide-react';
import { GameStats } from '../types';
import { formatEnergy, formatCurrency, formatTime } from '../utils/formatters';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetGame: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  soundEnabled,
  onToggleSound,
  onResetGame
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Thống Kê & Cài Đặt</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Quick Settings */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <div>
                <span className="font-semibold block">Âm thanh hiệu ứng</span>
                <span className="text-[11px] text-slate-400">Tiếng máy phát, tiếng chuông điện</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {soundEnabled ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số liệu trạm điện</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tổng điện sản xuất</span>
                </div>
                <div className="text-sm font-bold font-mono text-amber-300">
                  {formatEnergy(stats.totalEnergyProducedKwh)}
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tổng tiền kiếm được</span>
                </div>
                <div className="text-sm font-bold font-mono text-emerald-300">
                  {formatCurrency(stats.totalMoneyEarned)}
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Thời gian vận hành</span>
                </div>
                <div className="text-sm font-bold font-mono text-sky-300">
                  {formatTime(stats.timePlayedSeconds)}
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Số lần nhảy cầu dao</span>
                </div>
                <div className="text-sm font-bold font-mono text-rose-300">
                  {stats.totalBreakerTrips} lần
                </div>
              </div>
            </div>
          </div>

          {/* Reset Game Section */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa dữ liệu và chơi lại từ đầu không?')) {
                  onResetGame();
                  onClose();
                }
              }}
              className="w-full py-2 px-4 rounded-xl border border-rose-800/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại từ đầu (Xóa dữ liệu)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

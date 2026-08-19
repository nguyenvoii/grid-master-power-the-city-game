import React from 'react';
import { Battery, BatteryCharging, Zap, Building2, Activity, Coins, TrendingUp } from 'lucide-react';
import { formatPower, formatEnergy, formatCurrency, formatPercent } from '../utils/formatters';

interface EnergyMetricsProps {
  currentPowerGenKw: number;
  cityDemandKw: number;
  batteryKwh: number;
  maxBatteryKwh: number;
  stabilityPercent: number;
  money: number;
  incomePerSec: number;
  isBreakerTripped: boolean;
}

export const EnergyMetrics: React.FC<EnergyMetricsProps> = ({
  currentPowerGenKw,
  cityDemandKw,
  batteryKwh,
  maxBatteryKwh,
  stabilityPercent,
  money,
  incomePerSec,
  isBreakerTripped
}) => {
  const batteryPercent = maxBatteryKwh > 0 ? (batteryKwh / maxBatteryKwh) * 100 : 0;
  const isBatteryLow = batteryPercent < 20;
  const isBatteryFull = batteryPercent >= 98;

  const netKw = isBreakerTripped ? -cityDemandKw : currentPowerGenKw - cityDemandKw;
  const isSurplus = netKw >= 0;

  let stabilityText = 'Rất Tốt (100%)';
  if (stabilityPercent < 30 || isBreakerTripped) {
    stabilityText = 'Mất Điện / Nguy Cấp';
  } else if (stabilityPercent < 75) {
    stabilityText = 'Thiếu Điện Cục Bộ';
  } else if (stabilityPercent < 95) {
    stabilityText = 'Ổn Định';
  }

  const maxScale = Math.max(currentPowerGenKw, cityDemandKw, 0.1);
  const genBarPercent = Math.min(100, Math.max(3, (currentPowerGenKw / maxScale) * 100));
  const demandBarPercent = Math.min(100, Math.max(3, (cityDemandKw / maxScale) * 100));

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2.5">
      {/* Card 1: Power Generation vs City Demand Bar Chart */}
      <div 
        id="power-balance-card" 
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Cân Bằng Năng Lượng</span>
          </div>
          <div className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${isSurplus ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/70 text-rose-300 border border-rose-800/50'}`}>
            {isSurplus ? `+${formatPower(netKw)} Dư` : `-${formatPower(Math.abs(netKw))} Thiếu`}
          </div>
        </div>

        {/* Live Power Bar comparisons */}
        <div className="space-y-2 my-1">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Sản lượng phát
              </span>
              <span className="font-mono font-bold text-amber-300">
                {isBreakerTripped ? '0 W (Ngắt)' : formatPower(currentPowerGenKw)}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${isBreakerTripped ? 0 : genBarPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                Nhu cầu thành phố
              </span>
              <span className="font-mono font-bold text-sky-300">
                {formatPower(cityDemandKw)}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${demandBarPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Money footer */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Ngân quỹ:</span>
            <strong className="text-amber-300 font-mono text-sm">{formatCurrency(money)}</strong>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+{formatCurrency(incomePerSec)}/s</span>
          </div>
        </div>
      </div>

      {/* Card 2: Battery Storage & Grid Stability Gauge */}
      <div 
        id="storage-stability-card" 
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            {isSurplus ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className={`w-4 h-4 ${isBatteryLow ? 'text-rose-400' : 'text-slate-400'}`} />
            )}
            <span>Ắc Quy Dự Phòng</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {formatEnergy(batteryKwh)} / {formatEnergy(maxBatteryKwh)}
          </div>
        </div>

        {/* Battery Bar */}
        <div className="my-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Dung lượng tích trữ</span>
            <span className={`font-mono font-bold ${isBatteryLow ? 'text-rose-400' : isBatteryFull ? 'text-emerald-400' : 'text-slate-200'}`}>
              {formatPercent(batteryPercent)}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isBatteryLow 
                  ? 'bg-rose-500' 
                  : batteryPercent < 50 
                    ? 'bg-amber-400' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(1, batteryPercent))}%` }}
            />
          </div>
        </div>

        {/* Stability Gauge */}
        <div className="mt-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Độ ổn định lưới điện:
            </span>
            <span className="font-semibold text-xs text-slate-200 font-mono">
              {stabilityText}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-300 ${
                stabilityPercent > 80 ? 'bg-emerald-400' : stabilityPercent > 40 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${stabilityPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

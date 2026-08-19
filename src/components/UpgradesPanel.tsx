import React, { useState } from 'react';
import { 
  Zap, 
  RotateCw, 
  Fuel, 
  SunMedium, 
  Wind, 
  Waves, 
  Flame, 
  Atom, 
  Battery, 
  GitFork, 
  Wrench, 
  Building2, 
  Check, 
  ArrowUpRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { GeneratorDef, GeneratorType, BatteryUpgradeDef, GridUpgradeDef, ClickUpgradeDef, CityTier } from '../types';
import { formatPower, formatEnergy, formatCurrency } from '../utils/formatters';

interface UpgradesPanelProps {
  generators: GeneratorDef[];
  generatorCounts: Record<GeneratorType, number>;
  onBuyGenerator: (genId: GeneratorType, quantity: number) => void;
  
  batteryUpgrades: BatteryUpgradeDef[];
  batteryUpgradeLevel: number;
  onBuyBatteryUpgrade: (index: number) => void;
  
  gridUpgrades: GridUpgradeDef[];
  gridUpgradeLevels: Record<string, number>;
  onBuyGridUpgrade: (id: string) => void;
  
  clickUpgrades: ClickUpgradeDef[];
  clickUpgradeLevel: number;
  onBuyClickUpgrade: (index: number) => void;
  
  cityTiers: CityTier[];
  currentCityTierIndex: number;
  onUnlockCityTier: (tierIndex: number) => void;
  
  money: number;
}

type TabType = 'generators' | 'batteries' | 'grid' | 'click' | 'city';

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({
  generators,
  generatorCounts,
  onBuyGenerator,
  batteryUpgrades,
  batteryUpgradeLevel,
  onBuyBatteryUpgrade,
  gridUpgrades,
  gridUpgradeLevels,
  onBuyGridUpgrade,
  clickUpgrades,
  clickUpgradeLevel,
  onBuyClickUpgrade,
  cityTiers,
  currentCityTierIndex,
  onUnlockCityTier,
  money
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('generators');
  const [buyMultiplier, setBuyMultiplier] = useState<1 | 10>(1);

  const getGeneratorIcon = (iconName: string) => {
    switch (iconName) {
      case 'RotateCw': return <RotateCw className="w-5 h-5 text-amber-400" />;
      case 'Fuel': return <Fuel className="w-5 h-5 text-orange-400" />;
      case 'SunMedium': return <SunMedium className="w-5 h-5 text-yellow-300" />;
      case 'Wind': return <Wind className="w-5 h-5 text-cyan-300" />;
      case 'Waves': return <Waves className="w-5 h-5 text-blue-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Atom': return <Atom className="w-5 h-5 text-purple-400" />;
      default: return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  const getGeneratorCost = (gen: GeneratorDef, currentCount: number, countToBuy: number) => {
    let total = 0;
    for (let i = 0; i < countToBuy; i++) {
      total += gen.baseCost * Math.pow(gen.costMultiplier, currentCount + i);
    }
    return Math.floor(total);
  };

  return (
    <div id="upgrades-panel" className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-none bg-slate-950/60 p-1.5 gap-1">
        <button
          id="tab-generators"
          type="button"
          onClick={() => setActiveTab('generators')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'generators'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Máy Phát</span>
        </button>

        <button
          id="tab-batteries"
          type="button"
          onClick={() => setActiveTab('batteries')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'batteries'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Battery className="w-4 h-4" />
          <span>Ắc Quy</span>
        </button>

        <button
          id="tab-grid"
          type="button"
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'grid'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Lưới Điện</span>
        </button>

        <button
          id="tab-click"
          type="button"
          onClick={() => setActiveTab('click')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'click'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Quay Tay</span>
        </button>

        <button
          id="tab-city"
          type="button"
          onClick={() => setActiveTab('city')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'city'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Đô Thị</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3 max-h-[360px] overflow-y-auto space-y-2.5">
        {/* Tab 1: Generators */}
        {activeTab === 'generators' && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1 text-xs">
              <span className="text-slate-400">Nâng cấp nguồn phát điện tự động:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBuyMultiplier(1)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                    buyMultiplier === 1 ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  x1
                </button>
                <button
                  type="button"
                  onClick={() => setBuyMultiplier(10)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                    buyMultiplier === 10 ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  x10
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {generators.map((gen) => {
                const count = generatorCounts[gen.id] || 0;
                const isLocked = gen.unlockedAtCityTier > currentCityTierIndex;
                const cost = getGeneratorCost(gen, count, buyMultiplier);
                const canAfford = money >= cost && !isLocked;
                const totalOutputKw = gen.basePowerKw * count;

                if (isLocked) {
                  return (
                    <div 
                      key={gen.id} 
                      className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 opacity-60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-xl text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-400">
                            {gen.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Yêu cầu: <strong className="text-slate-400">{cityTiers[gen.unlockedAtCityTier]?.name}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Chưa mở
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={gen.id}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                      canAfford 
                        ? 'bg-slate-900/90 border-slate-700/80 hover:border-sky-500/50' 
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-slate-800/80 border border-slate-700/60 rounded-xl shrink-0">
                        {getGeneratorIcon(gen.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-100">{gen.name}</span>
                          <span className="bg-sky-950/80 text-sky-300 border border-sky-800/60 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                            x{count}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5 max-w-xs">{gen.desc}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                          <span className="text-amber-400">+{formatPower(gen.basePowerKw)}/máy</span>
                          {count > 0 && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-emerald-400">Tổng: {formatPower(totalOutputKw)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      id={`buy-gen-${gen.id}`}
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyGenerator(gen.id, buyMultiplier)}
                      className={`w-full sm:w-auto px-3 py-1.5 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      }`}
                    >
                      <span>Mua ({buyMultiplier > 1 ? `x${buyMultiplier}` : ''})</span>
                      <span>{formatCurrency(cost)}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Batteries */}
        {activeTab === 'batteries' && (
          <div className="space-y-2">
            <div className="px-1 text-xs text-slate-400 mb-1">
              Tăng sức chứa tích trữ năng lượng cho trạm phát:
            </div>
            {batteryUpgrades.map((bat, idx) => {
              const isOwned = batteryUpgradeLevel >= idx;
              const isCurrentTarget = batteryUpgradeLevel === idx - 1;
              const canAfford = money >= bat.cost && isCurrentTarget;

              return (
                <div
                  key={bat.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    isOwned
                      ? 'bg-slate-950/40 border-emerald-800/40'
                      : isCurrentTarget
                        ? canAfford 
                          ? 'bg-slate-900 border-slate-700' 
                          : 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/30 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${isOwned ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                      <Battery className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-100">{bat.name}</span>
                        {isOwned && (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Đang dùng
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{bat.desc}</p>
                      <div className="text-[11px] text-cyan-400 font-mono mt-0.5 font-semibold">
                        Sức chứa: {formatEnergy(bat.capacityKwh)}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isOwned ? (
                      <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/60 rounded-lg border border-emerald-800/50">
                        Kích hoạt
                      </span>
                    ) : isCurrentTarget ? (
                      <button
                        id={`buy-bat-${idx}`}
                        type="button"
                        disabled={!canAfford}
                        onClick={() => onBuyBatteryUpgrade(idx)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                      >
                        {formatCurrency(bat.cost)}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Khóa
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Grid */}
        {activeTab === 'grid' && (
          <div className="space-y-2">
            <div className="px-1 text-xs text-slate-400 mb-1">
              Cải tiến truyền tải, tăng giá bán điện và chống nhảy cầu dao:
            </div>
            {gridUpgrades.map((grid) => {
              const level = gridUpgradeLevels[grid.id] || 0;
              const isMaxed = level >= 1;
              const canAfford = money >= grid.cost && !isMaxed;

              return (
                <div
                  key={grid.id}
                  className={`p-2.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                    isMaxed
                      ? 'bg-slate-950/40 border-emerald-800/40'
                      : canAfford
                        ? 'bg-slate-900 border-slate-700'
                        : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl border ${isMaxed ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400' : 'bg-slate-800 border-slate-700 text-purple-400'}`}>
                      <GitFork className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-100">{grid.name}</span>
                        {isMaxed && (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold px-1.5 py-0.2 rounded-full">
                            Đã nâng cấp
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{grid.desc}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono mt-1">
                        <span className="text-emerald-400">+{grid.pricePerKwhBonusPercent}% giá</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-400">-{grid.lossReductionPercent}% hao hụt</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-400">+{grid.tripResistancePercent}% chống ngắt</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isMaxed ? (
                      <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/60 rounded-lg border border-emerald-800/50">
                        Đã sở hữu
                      </span>
                    ) : (
                      <button
                        id={`buy-grid-${grid.id}`}
                        type="button"
                        disabled={!canAfford}
                        onClick={() => onBuyGridUpgrade(grid.id)}
                        className={`w-full sm:w-auto px-3 py-1.5 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-purple-500 hover:bg-purple-400 active:scale-95 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                      >
                        {formatCurrency(grid.cost)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Click */}
        {activeTab === 'click' && (
          <div className="space-y-2">
            <div className="px-1 text-xs text-slate-400 mb-1">
              Gia tăng công suất phát điện mỗi cú chạm máy quay tay:
            </div>
            {clickUpgrades.map((item, idx) => {
              const isOwned = clickUpgradeLevel >= idx + 1;
              const isCurrentTarget = clickUpgradeLevel === idx;
              const canAfford = money >= item.cost && isCurrentTarget;

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    isOwned
                      ? 'bg-slate-950/40 border-emerald-800/40'
                      : isCurrentTarget
                        ? canAfford
                          ? 'bg-slate-900 border-slate-700'
                          : 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/30 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${isOwned ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400' : 'bg-slate-800 border-slate-700 text-amber-400'}`}>
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-100">{item.name}</span>
                        {isOwned && (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold px-1.5 py-0.2 rounded-full">
                            Đã nâng cấp
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                      <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                        +{formatPower(item.chargeBonus)} công suất quay tay
                      </div>
                    </div>
                  </div>

                  <div>
                    {isOwned ? (
                      <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/60 rounded-lg border border-emerald-800/50">
                        Đã có
                      </span>
                    ) : isCurrentTarget ? (
                      <button
                        id={`buy-click-${idx}`}
                        type="button"
                        disabled={!canAfford}
                        onClick={() => onBuyClickUpgrade(idx)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                      >
                        {formatCurrency(item.cost)}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Khóa
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 5: City Expansion */}
        {activeTab === 'city' && (
          <div className="space-y-2">
            <div className="px-1 text-xs text-slate-400 mb-1">
              Mở rộng quy mô phục vụ thành phố, tăng dân số và doanh thu tiền điện:
            </div>
            {cityTiers.map((tier, idx) => {
              const isCurrent = currentCityTierIndex === idx;
              const isPassed = currentCityTierIndex > idx;
              const isNext = currentCityTierIndex === idx - 1;
              const canUnlock = isNext && money >= tier.unlockCost;

              return (
                <div
                  key={tier.tier}
                  className={`p-2.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                    isCurrent
                      ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/40'
                      : isPassed
                        ? 'bg-slate-950/40 border-slate-800/60'
                        : isNext
                          ? canUnlock
                            ? 'bg-slate-900 border-slate-700'
                            : 'bg-slate-950/60 border-slate-800'
                          : 'bg-slate-950/30 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl border ${isCurrent ? 'bg-cyan-950 border-cyan-700 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-100">{tier.name}</span>
                        {isCurrent && (
                          <span className="bg-cyan-950 text-cyan-300 border border-cyan-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-3 h-3" /> Đang cấp điện
                          </span>
                        )}
                        {isPassed && (
                          <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.2 rounded-full">
                            Đã qua
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{tier.description}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono mt-1">
                        <span className="text-slate-300">Dân số: {tier.population.toLocaleString()}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-sky-300">Nhu cầu: ~{formatPower(tier.baseDemandKw)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <span className="text-xs text-cyan-400 font-semibold px-2.5 py-1 bg-cyan-950/80 rounded-lg border border-cyan-800">
                        Cấp hiện tại
                      </span>
                    ) : isPassed ? (
                      <span className="text-xs text-slate-500 font-semibold">Đã mở</span>
                    ) : isNext ? (
                      <button
                        id={`unlock-city-${idx}`}
                        type="button"
                        disabled={!canUnlock}
                        onClick={() => onUnlockCityTier(idx)}
                        className={`w-full sm:w-auto px-3.5 py-1.5 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          canUnlock
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Mở Rộng ({formatCurrency(tier.unlockCost)})</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Khóa
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

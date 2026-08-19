import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GameState, 
  GeneratorType, 
  GameEvent 
} from './types';
import { 
  GENERATORS_DATA, 
  CLICK_UPGRADES_DATA, 
  BATTERY_UPGRADES_DATA, 
  GRID_UPGRADES_DATA, 
  CITY_TIERS_DATA, 
  RANDOM_EVENTS_POOL 
} from './data/gameData';
import { soundManager } from './utils/audio';
import { CityVisualizer } from './components/CityVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { EnergyMetrics } from './components/EnergyMetrics';
import { UpgradesPanel } from './components/UpgradesPanel';
import { EventBanner } from './components/EventBanner';
import { StatsModal } from './components/StatsModal';
import { Settings, Volume2, VolumeX, Zap, Award } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tram_phat_dien_game_save_v1';

const INITIAL_STATE: GameState = {
  money: 0,
  batteryKwh: 2,
  maxBatteryKwh: 2,
  clickPowerKw: 0.05, // 50 W initial click
  generatorCounts: {
    hand_dynamo: 0,
    diesel_gen: 0,
    solar_roof: 0,
    wind_turbine: 0,
    hydro_mini: 0,
    biomass_plant: 0,
    micro_nuclear: 0
  },
  clickUpgradeLevel: 0,
  batteryUpgradeLevel: 0,
  gridUpgradeLevels: {},
  
  isBreakerTripped: false,
  stabilityPercent: 100,
  cityTierIndex: 0,
  
  activeEvents: [],
  stats: {
    totalClicks: 0,
    totalEnergyProducedKwh: 0,
    totalMoneyEarned: 0,
    totalBreakerTrips: 0,
    blackoutSeconds: 0,
    timePlayedSeconds: 0
  },
  
  soundEnabled: true,
  hapticsEnabled: true,
  timeOfDay: 0.25 // Starts at noon
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          activeEvents: [] // Reset events on reload
        };
      }
    } catch {}
    return INITIAL_STATE;
  });

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [currentPowerGenKw, setCurrentPowerGenKw] = useState(0);
  const [incomePerSec, setIncomePerSec] = useState(0);

  // References for loop
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // Auto-save every 5 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateRef.current));
      } catch {}
    }, 5000);
    return () => clearInterval(saveInterval);
  }, []);

  // Main Game Loop (runs every 100ms)
  useEffect(() => {
    const TICK_MS = 100;
    const DT_SEC = TICK_MS / 1000;
    let eventTimer = 0;

    const interval = setInterval(() => {
      setGameState((prevState) => {
        const currentCity = CITY_TIERS_DATA[prevState.cityTierIndex] || CITY_TIERS_DATA[0];

        // 1. Advance Time of Day (Full cycle in ~120s)
        const newTimeOfDay = (prevState.timeOfDay + (DT_SEC / 120)) % 1;

        // 2. Solar & Wind Natural Factors
        // Solar is 0 at night (0.6 to 1.0, 0 to 0.05), peaks at 0.25 (noon)
        let solarFactor = 0;
        if (newTimeOfDay > 0.05 && newTimeOfDay < 0.55) {
          // Daytime bell curve
          solarFactor = Math.sin(((newTimeOfDay - 0.05) / 0.5) * Math.PI) * 1.5;
        }

        // 3. Process Active Events
        let solarMultiplier = 1;
        let windMultiplier = 1;
        let demandMultiplier = 1;
        let moneyMultiplier = 1;

        const updatedEvents: GameEvent[] = [];
        for (const evt of prevState.activeEvents) {
          const rem = evt.remainingSeconds - DT_SEC;
          if (rem > 0) {
            updatedEvents.push({ ...evt, remainingSeconds: rem });
            if (evt.powerMultiplierSolar) solarMultiplier *= evt.powerMultiplierSolar;
            if (evt.powerMultiplierWind) windMultiplier *= evt.powerMultiplierWind;
            if (evt.demandMultiplier) demandMultiplier *= evt.demandMultiplier;
            if (evt.moneyMultiplier) moneyMultiplier *= evt.moneyMultiplier;
          }
        }

        // 4. Calculate Total Automatic Generation
        let autoGenKw = 0;
        if (!prevState.isBreakerTripped) {
          for (const gen of GENERATORS_DATA) {
            const count = prevState.generatorCounts[gen.id] || 0;
            if (count > 0) {
              if (gen.id === 'solar_roof') {
                autoGenKw += gen.basePowerKw * count * solarFactor * solarMultiplier;
              } else if (gen.id === 'wind_turbine') {
                autoGenKw += gen.basePowerKw * count * windMultiplier;
              } else {
                autoGenKw += gen.basePowerKw * count;
              }
            }
          }
        }

        setCurrentPowerGenKw(autoGenKw);

        // 5. City Demand
        const baseDemand = currentCity.baseDemandKw * demandMultiplier;

        // Grid upgrades bonus
        let lossReduction = 0;
        let priceBonus = 0;
        let tripResistance = 0;
        for (const grid of GRID_UPGRADES_DATA) {
          if (prevState.gridUpgradeLevels[grid.id]) {
            lossReduction += grid.lossReductionPercent;
            priceBonus += grid.pricePerKwhBonusPercent;
            tripResistance += grid.tripResistancePercent;
          }
        }

        const effectiveDemandKw = baseDemand * (1 - lossReduction * 0.01);
        const energyRequiredKwh = (effectiveDemandKw * DT_SEC) / 3600;

        // 6. Battery & Stability Balance
        let newBatteryKwh = prevState.batteryKwh;
        let newStability = prevState.stabilityPercent;
        let earnedMoneyThisTick = 0;
        let isBreakerTrippedNow = prevState.isBreakerTripped;

        const generatedKwhThisTick = (autoGenKw * DT_SEC) / 3600;

        if (isBreakerTrippedNow) {
          // If breaker tripped, 0 power provided
          newStability = Math.max(0, newStability - 15 * DT_SEC);
        } else if (autoGenKw >= effectiveDemandKw) {
          // Surplus power
          const surplusKwh = generatedKwhThisTick - energyRequiredKwh;
          newBatteryKwh = Math.min(prevState.maxBatteryKwh, newBatteryKwh + surplusKwh);
          newStability = Math.min(100, newStability + 10 * DT_SEC);

          // Full revenue: 1 kWh base = ~2500 VND
          const basePricePerKwh = 2500 * (1 + priceBonus * 0.01) * moneyMultiplier;
          earnedMoneyThisTick = energyRequiredKwh * basePricePerKwh;
        } else {
          // Deficit power: need to pull from battery
          const deficitKwh = energyRequiredKwh - generatedKwhThisTick;
          if (newBatteryKwh >= deficitKwh) {
            // Battery can cover deficit
            newBatteryKwh -= deficitKwh;
            newStability = Math.min(100, newStability + 2 * DT_SEC);
            const basePricePerKwh = 2500 * (1 + priceBonus * 0.01) * moneyMultiplier;
            earnedMoneyThisTick = energyRequiredKwh * basePricePerKwh;
          } else {
            // Battery empty!
            const energySuppliedKwh = generatedKwhThisTick + newBatteryKwh;
            newBatteryKwh = 0;
            const supplyRatio = effectiveDemandKw > 0 ? energySuppliedKwh / energyRequiredKwh : 0;
            newStability = Math.max(0, newStability - (1 - supplyRatio) * 20 * DT_SEC);

            const basePricePerKwh = 2500 * (1 + priceBonus * 0.01) * moneyMultiplier;
            earnedMoneyThisTick = energySuppliedKwh * basePricePerKwh;

            // Danger of breaker trip if stability drops critically low
            if (newStability <= 5 && Math.random() < 0.08 * (1 - tripResistance * 0.01)) {
              isBreakerTrippedNow = true;
              if (prevState.soundEnabled) soundManager.playBreakerTrip();
            }
          }
        }

        // Calculate live income/sec
        const instantIncomeSec = earnedMoneyThisTick * (1000 / TICK_MS);
        setIncomePerSec(instantIncomeSec);

        // 7. Periodic Random Events Triggering (every 35-50s)
        eventTimer += DT_SEC;
        if (eventTimer > 35 && updatedEvents.length === 0) {
          eventTimer = 0;
          if (Math.random() < 0.45) {
            const randomEvt = RANDOM_EVENTS_POOL[Math.floor(Math.random() * RANDOM_EVENTS_POOL.length)];
            if (randomEvt.type === 'breaker_trip') {
              // Breaker trip event
              if (!isBreakerTrippedNow && Math.random() > tripResistance * 0.01) {
                isBreakerTrippedNow = true;
                if (prevState.soundEnabled) soundManager.playBreakerTrip();
                updatedEvents.push({
                  ...randomEvt,
                  remainingSeconds: randomEvt.durationSeconds
                });
              }
            } else {
              updatedEvents.push({
                ...randomEvt,
                remainingSeconds: randomEvt.durationSeconds
              });
            }
          }
        }

        // 8. Update Stats
        const newStats = {
          ...prevState.stats,
          totalEnergyProducedKwh: prevState.stats.totalEnergyProducedKwh + generatedKwhThisTick,
          totalMoneyEarned: prevState.stats.totalMoneyEarned + earnedMoneyThisTick,
          timePlayedSeconds: prevState.stats.timePlayedSeconds + DT_SEC,
          blackoutSeconds: newStability <= 5 ? prevState.stats.blackoutSeconds + DT_SEC : prevState.stats.blackoutSeconds,
          totalBreakerTrips: isBreakerTrippedNow && !prevState.isBreakerTripped ? prevState.stats.totalBreakerTrips + 1 : prevState.stats.totalBreakerTrips
        };

        return {
          ...prevState,
          money: prevState.money + earnedMoneyThisTick,
          batteryKwh: newBatteryKwh,
          stabilityPercent: newStability,
          isBreakerTripped: isBreakerTrippedNow,
          timeOfDay: newTimeOfDay,
          activeEvents: updatedEvents,
          stats: newStats
        };
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);

  // Manual Click Generator handler
  const handleManualClick = useCallback(() => {
    setGameState((prev) => {
      if (prev.isBreakerTripped) return prev;

      if (prev.soundEnabled) {
        soundManager.playClick(prev.clickUpgradeLevel + 1);
      }

      // Add energy to battery directly on click
      const energyAddedKwh = (prev.clickPowerKw * 1.5) / 3600; // 1.5s worth of power
      const newBattery = Math.min(prev.maxBatteryKwh, prev.batteryKwh + energyAddedKwh);
      const newStability = Math.min(100, prev.stabilityPercent + 2.5);

      return {
        ...prev,
        batteryKwh: newBattery,
        stabilityPercent: newStability,
        stats: {
          ...prev.stats,
          totalClicks: prev.stats.totalClicks + 1,
          totalEnergyProducedKwh: prev.stats.totalEnergyProducedKwh + energyAddedKwh
        }
      };
    });
  }, []);

  // Reset Breaker Switch
  const handleResetBreaker = useCallback(() => {
    setGameState((prev) => {
      if (prev.soundEnabled) {
        soundManager.playBreakerReset();
      }
      return {
        ...prev,
        isBreakerTripped: false,
        stabilityPercent: Math.max(25, prev.stabilityPercent + 25),
        activeEvents: prev.activeEvents.filter(e => e.type !== 'breaker_trip')
      };
    });
  }, []);

  // Buy Generator
  const handleBuyGenerator = useCallback((genId: GeneratorType, quantity: number) => {
    setGameState((prev) => {
      const gen = GENERATORS_DATA.find(g => g.id === genId);
      if (!gen) return prev;

      const currentCount = prev.generatorCounts[genId] || 0;
      let totalCost = 0;
      for (let i = 0; i < quantity; i++) {
        totalCost += gen.baseCost * Math.pow(gen.costMultiplier, currentCount + i);
      }
      totalCost = Math.floor(totalCost);

      if (prev.money < totalCost) return prev;

      if (prev.soundEnabled) soundManager.playBuy();

      return {
        ...prev,
        money: prev.money - totalCost,
        generatorCounts: {
          ...prev.generatorCounts,
          [genId]: currentCount + quantity
        }
      };
    });
  }, []);

  // Buy Battery Upgrade
  const handleBuyBatteryUpgrade = useCallback((index: number) => {
    setGameState((prev) => {
      const bat = BATTERY_UPGRADES_DATA[index];
      if (!bat || prev.money < bat.cost || prev.batteryUpgradeLevel >= index) return prev;

      if (prev.soundEnabled) soundManager.playBuy();

      return {
        ...prev,
        money: prev.money - bat.cost,
        batteryUpgradeLevel: index,
        maxBatteryKwh: bat.capacityKwh,
        batteryKwh: Math.min(bat.capacityKwh, prev.batteryKwh + bat.capacityKwh * 0.3)
      };
    });
  }, []);

  // Buy Grid Upgrade
  const handleBuyGridUpgrade = useCallback((gridId: string) => {
    setGameState((prev) => {
      const grid = GRID_UPGRADES_DATA.find(g => g.id === gridId);
      if (!grid || prev.money < grid.cost || prev.gridUpgradeLevels[gridId]) return prev;

      if (prev.soundEnabled) soundManager.playBuy();

      return {
        ...prev,
        money: prev.money - grid.cost,
        gridUpgradeLevels: {
          ...prev.gridUpgradeLevels,
          [gridId]: 1
        }
      };
    });
  }, []);

  // Buy Click Upgrade
  const handleBuyClickUpgrade = useCallback((index: number) => {
    setGameState((prev) => {
      const item = CLICK_UPGRADES_DATA[index];
      if (!item || prev.money < item.cost || prev.clickUpgradeLevel > index) return prev;

      if (prev.soundEnabled) soundManager.playBuy();

      return {
        ...prev,
        money: prev.money - item.cost,
        clickUpgradeLevel: index + 1,
        clickPowerKw: prev.clickPowerKw * item.powerMultiplier + item.chargeBonus
      };
    });
  }, []);

  // Unlock City Tier
  const handleUnlockCityTier = useCallback((tierIndex: number) => {
    setGameState((prev) => {
      const tier = CITY_TIERS_DATA[tierIndex];
      if (!tier || prev.money < tier.unlockCost || prev.cityTierIndex >= tierIndex) return prev;

      if (prev.soundEnabled) soundManager.playLevelUp();

      return {
        ...prev,
        money: prev.money - tier.unlockCost,
        cityTierIndex: tierIndex
      };
    });
  }, []);

  // Event interactive action
  const handleEventAction = useCallback((evt: GameEvent) => {
    if (evt.type === 'breaker_trip') {
      handleResetBreaker();
    }
  }, [handleResetBreaker]);

  // Reset Game Data
  const handleResetGame = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setGameState(INITIAL_STATE);
  }, []);

  const currentCity = CITY_TIERS_DATA[gameState.cityTierIndex] || CITY_TIERS_DATA[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center select-none font-sans">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-4xl px-3 sm:px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight leading-none">
              Trạm Phát Điện Mini
            </h1>
            <span className="text-[11px] text-slate-400">
              Quản lý & thắp sáng thành phố
            </span>
          </div>
        </div>

        {/* Right buttons: Audio toggle & Stats/Settings */}
        <div className="flex items-center gap-1.5">
          <button
            id="toggle-sound-btn"
            type="button"
            onClick={() => setGameState(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            title={gameState.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {gameState.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            id="open-stats-btn"
            type="button"
            onClick={() => setIsStatsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Thống kê</span>
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="w-full max-w-4xl p-3 sm:p-4 flex-1 flex flex-col gap-3.5">
        {/* Active Weather & Game Event Banners */}
        <EventBanner 
          events={gameState.activeEvents} 
          onEventAction={handleEventAction}
        />

        {/* Energy Meters & Balances */}
        <EnergyMetrics
          currentPowerGenKw={currentPowerGenKw}
          cityDemandKw={currentCity.baseDemandKw}
          batteryKwh={gameState.batteryKwh}
          maxBatteryKwh={gameState.maxBatteryKwh}
          stabilityPercent={gameState.stabilityPercent}
          money={gameState.money}
          incomePerSec={incomePerSec}
          isBreakerTripped={gameState.isBreakerTripped}
        />

        {/* Main Central Interaction & Upgrades Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* Left Column: Big Interactive Dynamo Button & Breaker */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-sm">
            <ControlPanel
              clickPowerKw={gameState.clickPowerKw}
              isBreakerTripped={gameState.isBreakerTripped}
              onManualClick={handleManualClick}
              onResetBreaker={handleResetBreaker}
              totalClickProducedKwh={gameState.stats.totalClicks * ((gameState.clickPowerKw * 1.5) / 3600)}
              clickUpgradeLevel={gameState.clickUpgradeLevel}
            />
          </div>

          {/* Right Column: Upgrades Panel (Generators, Batteries, Grid, City) */}
          <div className="lg:col-span-7">
            <UpgradesPanel
              generators={GENERATORS_DATA}
              generatorCounts={gameState.generatorCounts}
              onBuyGenerator={handleBuyGenerator}
              
              batteryUpgrades={BATTERY_UPGRADES_DATA}
              batteryUpgradeLevel={gameState.batteryUpgradeLevel}
              onBuyBatteryUpgrade={handleBuyBatteryUpgrade}
              
              gridUpgrades={GRID_UPGRADES_DATA}
              gridUpgradeLevels={gameState.gridUpgradeLevels}
              onBuyGridUpgrade={handleBuyGridUpgrade}
              
              clickUpgrades={CLICK_UPGRADES_DATA}
              clickUpgradeLevel={gameState.clickUpgradeLevel}
              onBuyClickUpgrade={handleBuyClickUpgrade}
              
              cityTiers={CITY_TIERS_DATA}
              currentCityTierIndex={gameState.cityTierIndex}
              onUnlockCityTier={handleUnlockCityTier}
              
              money={gameState.money}
            />
          </div>
        </div>

        {/* Bottom Section: The Responsive City Visualizer Skyline */}
        <div className="w-full mt-1">
          <CityVisualizer
            stabilityPercent={gameState.stabilityPercent}
            isBreakerTripped={gameState.isBreakerTripped}
            timeOfDay={gameState.timeOfDay}
            cityTierIndex={gameState.cityTierIndex}
            cityName={currentCity.name}
            population={currentCity.population}
            activeEvents={gameState.activeEvents}
          />
        </div>
      </main>

      {/* Stats & Settings Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={gameState.stats}
        soundEnabled={gameState.soundEnabled}
        onToggleSound={() => setGameState(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onResetGame={handleResetGame}
      />
    </div>
  );
}

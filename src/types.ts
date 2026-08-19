export type GeneratorType = 
  | 'hand_dynamo'
  | 'diesel_gen'
  | 'solar_roof'
  | 'wind_turbine'
  | 'hydro_mini'
  | 'biomass_plant'
  | 'micro_nuclear';

export interface GeneratorDef {
  id: GeneratorType;
  name: string;
  desc: string;
  icon: string;
  baseCost: number;
  costMultiplier: number;
  basePowerKw: number; // in kW (1 kW = 1000 W)
  unlockedAtCityTier: number;
  category: 'manual' | 'fuel' | 'renewable' | 'advanced';
}

export interface BatteryUpgradeDef {
  id: string;
  name: string;
  desc: string;
  capacityKwh: number;
  cost: number;
  levelRequired: number;
}

export interface GridUpgradeDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  lossReductionPercent: number;
  pricePerKwhBonusPercent: number;
  tripResistancePercent: number;
}

export interface ClickUpgradeDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  powerMultiplier: number;
  chargeBonus: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'storm' | 'heatwave' | 'overload' | 'festival' | 'breaker_trip' | 'maintenance' | 'bonus';
  durationSeconds: number;
  remainingSeconds: number;
  powerMultiplierSolar?: number;
  powerMultiplierWind?: number;
  demandMultiplier?: number;
  moneyMultiplier?: number;
  requiresAction?: boolean;
  actionLabel?: string;
}

export interface CityTier {
  tier: number;
  name: string;
  population: number;
  baseDemandKw: number;
  unlockCost: number;
  description: string;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color?: string;
}

export interface ParticleEffect {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export interface GameStats {
  totalClicks: number;
  totalEnergyProducedKwh: number;
  totalMoneyEarned: number;
  totalBreakerTrips: number;
  blackoutSeconds: number;
  timePlayedSeconds: number;
}

export interface GameState {
  money: number; // VND
  batteryKwh: number; // Current stored kWh
  maxBatteryKwh: number; // Max storage
  clickPowerKw: number; // Power generated per click
  generatorCounts: Record<GeneratorType, number>;
  clickUpgradeLevel: number;
  batteryUpgradeLevel: number;
  gridUpgradeLevels: Record<string, number>;
  
  isBreakerTripped: boolean;
  stabilityPercent: number; // 0 - 100
  cityTierIndex: number;
  
  activeEvents: GameEvent[];
  stats: GameStats;
  
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  timeOfDay: number; // 0.0 to 1.0
}

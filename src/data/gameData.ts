import { GeneratorDef, BatteryUpgradeDef, GridUpgradeDef, ClickUpgradeDef, CityTier, GameEvent } from '../types';

export const GENERATORS_DATA: GeneratorDef[] = [
  {
    id: 'hand_dynamo',
    name: 'Máy quay tay trợ lực',
    desc: 'Ròng rọc gắn lò xo tự quay phát điện liên tục.',
    icon: 'RotateCw',
    baseCost: 35,
    costMultiplier: 1.15,
    basePowerKw: 0.05, // 50 W
    unlockedAtCityTier: 0,
    category: 'manual'
  },
  {
    id: 'diesel_gen',
    name: 'Máy nổ Diesel dân dụng',
    desc: 'Động cơ đốt trong phát điện ổn định 24/7.',
    icon: 'Fuel',
    baseCost: 200,
    costMultiplier: 1.16,
    basePowerKw: 0.35, // 350 W
    unlockedAtCityTier: 0,
    category: 'fuel'
  },
  {
    id: 'solar_roof',
    name: 'Mái pin Năng lượng Mặt trời',
    desc: 'Hấp thụ ánh sáng, hiệu suất tăng mạnh vào ban ngày.',
    icon: 'SunMedium',
    baseCost: 900,
    costMultiplier: 1.18,
    basePowerKw: 1.6, // 1.6 kW
    unlockedAtCityTier: 1,
    category: 'renewable'
  },
  {
    id: 'wind_turbine',
    name: 'Tuabin gió đồi cao',
    desc: 'Khai thác luồng gió tự nhiên cả ngày lẫn đêm.',
    icon: 'Wind',
    baseCost: 4200,
    costMultiplier: 1.2,
    basePowerKw: 7.5, // 7.5 kW
    unlockedAtCityTier: 1,
    category: 'renewable'
  },
  {
    id: 'hydro_mini',
    name: 'Trạm Thủy điện mini',
    desc: 'Khai thác dòng nước suối chảy xiết, nguồn năng lượng dồi dào.',
    icon: 'Waves',
    baseCost: 22000,
    costMultiplier: 1.22,
    basePowerKw: 35.0, // 35 kW
    unlockedAtCityTier: 2,
    category: 'renewable'
  },
  {
    id: 'biomass_plant',
    name: 'Nhà máy Sinh khối Biogas',
    desc: 'Biến phụ phẩm nông nghiệp thành điện năng công suất lớn.',
    icon: 'Flame',
    baseCost: 110000,
    costMultiplier: 1.24,
    basePowerKw: 180.0, // 180 kW
    unlockedAtCityTier: 3,
    category: 'fuel'
  },
  {
    id: 'micro_nuclear',
    name: 'Lò phản ứng Hạt nhân Module (SMR)',
    desc: 'Công nghệ điện hạt nhân vi mô an toàn, công suất khổng lồ.',
    icon: 'Atom',
    baseCost: 650000,
    costMultiplier: 1.28,
    basePowerKw: 950.0, // 950 kW
    unlockedAtCityTier: 4,
    category: 'advanced'
  }
];

export const CLICK_UPGRADES_DATA: ClickUpgradeDef[] = [
  {
    id: 'click_1',
    name: 'Tay quay Hợp kim nhôm',
    desc: 'Tăng 100% công suất mỗi lần nhấn',
    cost: 50,
    powerMultiplier: 2,
    chargeBonus: 0.05
  },
  {
    id: 'click_2',
    name: 'Cuộn dây đồng siêu dẫn',
    desc: 'Giảm ma sát từ trường, x2.5 công suất nhấn',
    cost: 400,
    powerMultiplier: 2.5,
    chargeBonus: 0.15
  },
  {
    id: 'click_3',
    name: 'Bánh đà tích năng động lực',
    desc: 'Mỗi cú nhấn tạo thêm xung điện lan truyền mạnh mẽ',
    cost: 2500,
    powerMultiplier: 3,
    chargeBonus: 0.45
  },
  {
    id: 'click_4',
    name: 'Tụ điện lượng tử tăng áp',
    desc: 'Biến mỗi lần chạm thành dòng điện xung đỉnh cao',
    cost: 18000,
    powerMultiplier: 4,
    chargeBonus: 1.5
  },
  {
    id: 'click_5',
    name: 'Hệ thống kích từ vi lượng',
    desc: 'Công suất nhấn đạt tầm cỡ công nghiệp',
    cost: 150000,
    powerMultiplier: 5,
    chargeBonus: 5.0
  }
];

export const BATTERY_UPGRADES_DATA: BatteryUpgradeDef[] = [
  {
    id: 'bat_0',
    name: 'Ắc quy xe máy cũ',
    desc: 'Bình ắc quy sơ cấp tạm thời',
    capacityKwh: 2,
    cost: 0,
    levelRequired: 0
  },
  {
    id: 'bat_1',
    name: 'Dàn Ắc quy Chì-Axit 12V',
    desc: 'Lưu trữ điện dư thừa lúc phát nhiều',
    capacityKwh: 10,
    cost: 120,
    levelRequired: 1
  },
  {
    id: 'bat_2',
    name: 'Cụm Pin Lithium-ion Gia đình',
    desc: 'Nạp xả nhanh, trữ được 50 kWh',
    capacityKwh: 50,
    cost: 850,
    levelRequired: 2
  },
  {
    id: 'bat_3',
    name: 'Khối Pin Công nghiệp Megapack',
    desc: 'Đảm bảo thành phố không cúp điện khi có biến cố',
    capacityKwh: 250,
    cost: 5500,
    levelRequired: 3
  },
  {
    id: 'bat_4',
    name: 'Trạm Lưu trữ Năng lượng Thể rắn',
    desc: 'Trữ đến 1.2 MWh điện, siêu an toàn và bền bỉ',
    capacityKwh: 1200,
    cost: 38000,
    levelRequired: 4
  },
  {
    id: 'bat_5',
    name: 'Hầm Lưu trữ Từ trường Siêu dẫn (SMES)',
    desc: 'Dung lượng khổng lồ 8 MWh sẵn sàng cho đại đô thị',
    capacityKwh: 8000,
    cost: 260000,
    levelRequired: 5
  }
];

export const GRID_UPGRADES_DATA: GridUpgradeDef[] = [
  {
    id: 'copper_cables',
    name: 'Dây cáp nhôm-đồng bọc cách điện',
    desc: 'Giảm 15% hao hụt truyền tải trên đường dây.',
    cost: 180,
    lossReductionPercent: 15,
    pricePerKwhBonusPercent: 10,
    tripResistancePercent: 20
  },
  {
    id: 'smart_transformer',
    name: 'Trạm Biến áp Thông minh',
    desc: 'Tự động điều áp, tăng 25% giá bán điện do chất lượng dòng điện sạch.',
    cost: 1200,
    lossReductionPercent: 20,
    pricePerKwhBonusPercent: 25,
    tripResistancePercent: 35
  },
  {
    id: 'lightning_arrester',
    name: 'Hệ thống Chống sét & Cân bằng tải AI',
    desc: 'Giảm 60% nguy cơ nhảy cầu dao khi có bão giông hoặc quá tải.',
    cost: 8500,
    lossReductionPercent: 25,
    pricePerKwhBonusPercent: 40,
    tripResistancePercent: 60
  },
  {
    id: 'superconductor_lines',
    name: 'Lưới điện Siêu dẫn Nhiệt độ phòng',
    desc: 'Hao hụt truyền tải về gần 0, tối ưu hóa giá trị điện năng.',
    cost: 75000,
    lossReductionPercent: 40,
    pricePerKwhBonusPercent: 75,
    tripResistancePercent: 85
  }
];

export const CITY_TIERS_DATA: CityTier[] = [
  {
    tier: 0,
    name: 'Xóm Làng Bình Yên',
    population: 150,
    baseDemandKw: 0.15, // 150 W demand
    unlockCost: 0,
    description: 'Một xóm nhỏ với vài mái nhà ấm cúng cần điện thắp sáng ban đêm.'
  },
  {
    tier: 1,
    name: 'Thị Trấn Ven Sông',
    population: 1200,
    baseDemandKw: 1.8, // 1.8 kW demand
    unlockCost: 1500,
    description: 'Thị trấn đông đúc với phố chợ, đèn đường và cửa hàng buôn bán.'
  },
  {
    tier: 2,
    name: 'Khu Đô Thị Mới',
    population: 8500,
    baseDemandKw: 14.0, // 14 kW demand
    unlockCost: 18000,
    description: 'Nhiều chung cư cao tầng, bệnh viện, trường học và trung tâm thương mại.'
  },
  {
    tier: 3,
    name: 'Thành Phố Công Nghiệp',
    population: 45000,
    baseDemandKw: 85.0, // 85 kW demand
    unlockCost: 120000,
    description: 'Thành phố sầm uất với các khu công nghệ cao, nhà xưởng và cảng biển.'
  },
  {
    tier: 4,
    name: 'Đại Đô Thị Tương Lai (Mega City)',
    population: 250000,
    baseDemandKw: 450.0, // 450 kW demand
    unlockCost: 800000,
    description: 'Siêu đô thị rực rỡ ánh sáng neon, tàu điện ngầm và tháp chọc trời.'
  }
];

export const RANDOM_EVENTS_POOL: Array<Omit<GameEvent, 'remainingSeconds'>> = [
  {
    id: 'storm_wind',
    title: '⛈️ Bão Giông Đổ Bộ',
    description: 'Gió giật mạnh làm tuabin gió tăng 250% công suất, nhưng có sấm sét!',
    type: 'storm',
    durationSeconds: 25,
    powerMultiplierWind: 2.5,
    powerMultiplierSolar: 0.2
  },
  {
    id: 'heatwave_sunny',
    title: '☀️ Nắng Gắt Giữa Trưa',
    description: 'Tấm pin mặt trời đạt đỉnh +150% hiệu suất, điều hòa thành phố dùng thêm 20% điện.',
    type: 'heatwave',
    durationSeconds: 30,
    powerMultiplierSolar: 2.5,
    demandMultiplier: 1.2
  },
  {
    id: 'rush_hour',
    title: '⚡ Giờ Cao Điểm Thành Phố',
    description: 'Nhu cầu điện tăng 40%! Nếu đáp ứng đủ 100%, tiền bán điện gấp đôi (x2)!',
    type: 'overload',
    durationSeconds: 20,
    demandMultiplier: 1.4,
    moneyMultiplier: 2.0
  },
  {
    id: 'city_festival',
    title: '🏮 Lễ Hội Ánh Sáng Thành Phố',
    description: 'Thành phố trang hoàng đèn hoa rực rỡ! Doanh thu bán điện tăng 2.5 lần!',
    type: 'festival',
    durationSeconds: 30,
    moneyMultiplier: 2.5
  },
  {
    id: 'breaker_surge',
    title: '⚠️ Cầu Dao Nhảy Đột Ngột!',
    description: 'Quá tải ngắn mạch! Cầu dao trạm phát đã tự ngắt bảo vệ. Hãy bấm nút gạt lại ngay!',
    type: 'breaker_trip',
    durationSeconds: 15,
    requiresAction: true,
    actionLabel: 'GẠT LẠI CẦU DAO'
  }
];

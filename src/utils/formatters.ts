// Number and unit formatters for energy, currency and power

export function formatPower(kw: number): string {
  if (kw < 0.001) return '0 W';
  if (kw < 1) {
    return `${Math.round(kw * 1000)} W`;
  }
  if (kw < 1000) {
    return `${kw.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} kW`;
  }
  if (kw < 1000000) {
    return `${(kw / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} MW`;
  }
  return `${(kw / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} GW`;
}

export function formatEnergy(kwh: number): string {
  if (kwh < 0.001) return '0 Wh';
  if (kwh < 1) {
    return `${Math.round(kwh * 1000)} Wh`;
  }
  if (kwh < 1000) {
    return `${kwh.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} kWh`;
  }
  if (kwh < 1000000) {
    return `${(kwh / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} MWh`;
  }
  return `${(kwh / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} GWh`;
}

export function formatCurrency(amount: number): string {
  if (amount < 10000) {
    return `${Math.floor(amount).toLocaleString('vi-VN')} đ`;
  }
  if (amount < 1000000) {
    return `${(amount / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}k đ`;
  }
  if (amount < 1000000000) {
    return `${(amount / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}M đ`;
  }
  return `${(amount / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}B đ`;
}

export function formatPercent(value: number): string {
  return `${Math.round(Math.min(100, Math.max(0, value)))}%`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}p ${secs}s`;
}

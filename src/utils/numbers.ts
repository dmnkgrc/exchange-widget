import { currenciesConfig, Currency } from './../config/currencies';
export function roundNumber(num: number, places = 4) {
  const multiplier = Math.pow(10, places);
  // EPSILON avoids weird rounding values
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
}

export function getDecimalPlaces(num: number) {
  if (Math.floor(num) === num) return 0;
  return num.toString().split('.')[1].length ?? 0;
}

export function formatAmount(num: number, currency: Currency) {
  const { symbol } = currenciesConfig[currency];
  if (num < 0) {
    return `- ${symbol}${Math.abs(num).toLocaleString()}`;
  } else if (num === 0) {
    return `${symbol}${num.toLocaleString()}`;
  }
  return `+ ${symbol}${num.toLocaleString()}`;
}

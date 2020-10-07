export function roundNumber(num: number, places = 4) {
  const multiplier = Math.pow(10, places);
  // EPSILON avoids weird rounding values
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
}

export function getDecimalPlaces(num: number) {
  if (Math.floor(num) === num) return 0;
  return num.toString().split('.')[1].length ?? 0;
}

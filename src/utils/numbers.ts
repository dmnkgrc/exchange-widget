export function roundNumber(num: number, places = 4) {
  const multiplier = Math.pow(10, places);
  // EPSILON avoids weird rounding values
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
}

import { roundNumber } from '../numbers';

describe('Numbers', () => {
  test('it should not modify integers', () => {
    expect(roundNumber(2)).toEqual(2);
  });

  test('it should not modify floats with less decimals', () => {
    expect(roundNumber(1.005)).toEqual(1.005);
  });

  test('it rounds correctly', () => {
    expect(roundNumber(1.00005)).toEqual(1.0001);
  });
});

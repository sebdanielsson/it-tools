import { afterEach, describe, expect, it, vi } from 'vitest';
import { randFromArray, randIndex, randIntFromInterval, random, shuffleArray } from './random';

describe('random', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not use Math.random', () => {
    const spy = vi.spyOn(Math, 'random');
    random();
    randIndex(10);
    shuffleArray([1, 2, 3]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('random() returns floats in [0, 1)', () => {
    for (let i = 0; i < 1000; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('randIndex() covers [0, max) and rejects invalid bounds', () => {
    const seen = new Set(Array.from({ length: 1000 }, () => randIndex(3)));
    expect([...seen].sort((a, b) => a - b)).toEqual([0, 1, 2]);
    expect(() => randIndex(0)).toThrow(RangeError);
    expect(() => randIndex(1.5)).toThrow(RangeError);
  });

  it('randIntFromInterval() includes both bounds', () => {
    const seen = new Set(Array.from({ length: 1000 }, () => randIntFromInterval(5, 7)));
    expect([...seen].sort((a, b) => a - b)).toEqual([5, 6, 7]);
  });

  it('randFromArray() returns undefined for an empty array', () => {
    expect(randFromArray([])).toBeUndefined();
    expect(randFromArray(['a'])).toBe('a');
  });

  it('shuffleArray() returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(input);
  });
});

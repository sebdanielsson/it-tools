// Backed by crypto.getRandomValues(): the token, password, passphrase, PIN and salt generators rely on these helpers.

const UINT32_RANGE = 2 ** 32;
const pool = new Uint32Array(256);
let poolIndex = pool.length;

function randomUint32(): number {
  if (poolIndex === pool.length) {
    crypto.getRandomValues(pool);
    poolIndex = 0;
  }
  return pool[poolIndex++];
}

// Uniform integer in [0, max), rejection sampling avoids modulo bias
function randIndex(max: number): number {
  if (!Number.isInteger(max) || max < 1 || max > UINT32_RANGE) {
    throw new RangeError(`randIndex: max must be an integer between 1 and 2^32, got ${max}`);
  }
  const limit = UINT32_RANGE - (UINT32_RANGE % max);
  let value = randomUint32();
  while (value >= limit) {
    value = randomUint32();
  }
  return value % max;
}

// Float in [0, 1) with 53 bits of precision, like Math.random()
const random = () => ((randomUint32() >>> 5) * 2 ** 26 + (randomUint32() >>> 6)) / 2 ** 53;

const randFromArray = <T>(array: T[]): T | undefined => (array.length > 0 ? array[randIndex(array.length)] : undefined);

const multiRandFromArray = <T>(array: T[], length: number) => Array.from({ length }, () => randFromArray(array));

// Integer in [min, max], both bounds included
const randIntFromInterval = (min: number, max: number) => min + randIndex(max - min + 1);

// Durstenfeld shuffle
function shuffleArrayMutate<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randIndex(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const shuffleArray = <T>(array: T[]): T[] => shuffleArrayMutate([...array]);

const shuffleString = (str: string, delimiter = ''): string => shuffleArrayMutate(str.split(delimiter)).join(delimiter);

const generateRandomId = () => `id-${random().toString(36).substring(2, 12)}`;

export {
  randFromArray,
  multiRandFromArray,
  randIndex,
  randIntFromInterval,
  random,
  shuffleArray,
  shuffleArrayMutate,
  shuffleString,
  generateRandomId,
};

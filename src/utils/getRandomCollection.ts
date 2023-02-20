import crypto from 'node:crypto';

export function getRandomValues<T>(
  list: T[],
  amount: number = 5
): T[] {
  const shuffledNames = [...list];

  for (let i = shuffledNames.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [shuffledNames[i], shuffledNames[j]] = [
      shuffledNames[j],
      shuffledNames[i],
    ];
  }

  return shuffledNames.slice(0, amount);
}

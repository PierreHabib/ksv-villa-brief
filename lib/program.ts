export type AreaRange = { min: number; max: number };

const programAreaRanges: Record<number, AreaRange> = {
  1: { min: 180, max: 230 },
  2: { min: 220, max: 280 },
  3: { min: 260, max: 320 },
  4: { min: 300, max: 380 },
  5: { min: 340, max: 440 },
  6: { min: 380, max: 500 }
};

export function getProgramAreaRange(bedrooms: number): AreaRange {
  return programAreaRanges[bedrooms] ?? programAreaRanges[3];
}

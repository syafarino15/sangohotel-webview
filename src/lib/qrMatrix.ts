export const QR_GRID = 25;

const hashString = (input: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Matriks QR simulasi: pola diturunkan deterministik dari isi `value` sehingga
 * nilai yang sama selalu menghasilkan gambar yang sama. Dipakai bersama oleh
 * komponen layar dan pembuat PDF agar keduanya identik.
 */
export const buildQrMatrix = (value: string): boolean[][] => {
  const random = mulberry32(hashString(value));
  const matrix: boolean[][] = Array.from({ length: QR_GRID }, () =>
    Array.from({ length: QR_GRID }, () => false)
  );

  const drawFinder = (top: number, left: number) => {
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const border = row === 0 || row === 6 || col === 0 || col === 6;
        const core = row >= 2 && row <= 4 && col >= 2 && col <= 4;
        matrix[top + row][left + col] = border || core;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, QR_GRID - 7);
  drawFinder(QR_GRID - 7, 0);

  for (let row = 0; row < QR_GRID; row += 1) {
    for (let col = 0; col < QR_GRID; col += 1) {
      const inFinderArea =
        (row < 8 && col < 8) ||
        (row < 8 && col > QR_GRID - 9) ||
        (row > QR_GRID - 9 && col < 8);

      if (inFinderArea) {
        continue;
      }

      if (row === 6 || col === 6) {
        matrix[row][col] = (row + col) % 2 === 0;
        continue;
      }

      matrix[row][col] = random() > 0.5;
    }
  }

  return matrix;
};
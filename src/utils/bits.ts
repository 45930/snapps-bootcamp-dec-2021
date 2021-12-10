/*
 @dev only works on smaller numbers :(
*/
export function bToString(b: number): string {
  let y = Math.floor(b / 2 ** 32);
  return [y, y << 8, y << 16, y << 24, b, b << 8, b << 16, b << 24]
    .map((z) => z >>> 24)
    .map((x) => String.fromCharCode(x))
    .reverse()
    .join('');
}

export function stringToBits(s: string): Array<boolean> {
  let bits: Array<boolean> = [];
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    bits = bits.concat(numberToBits(c));
  }
  return bits;
}

export function numberToBits(n: number): Array<boolean> {
  let bits = [];
  for (let i = 0; i < 8; i++) {
    bits.push(((n >> i) & 1) === 1);
  }
  return bits;
}

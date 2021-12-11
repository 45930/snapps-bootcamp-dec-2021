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

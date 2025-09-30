import { fromHex } from '@mysten/bcs';

export function fromHexString(hexString: string): Uint8Array {
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  return fromHex(cleanHex);
}
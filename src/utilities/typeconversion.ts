import { fromBase64, toBase64, fromHex, toHex } from '@mysten/bcs';

export class TypeConversion {
  static base64ToUint8Array(base64: string): Uint8Array {
    return fromBase64(base64);
  }

  static uint8ArrayToBase64(data: Uint8Array): string {
    return toBase64(data);
  }

  static hexToUint8Array(hex: string): Uint8Array {
    return fromHex(hex);
  }

  static uint8ArrayToHex(data: Uint8Array): string {
    return toHex(data);
  }

  static stringToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  static uint8ArrayToString(data: Uint8Array): string {
    return new TextDecoder().decode(data);
  }
}
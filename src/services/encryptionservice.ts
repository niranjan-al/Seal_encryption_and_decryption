import { sealClient } from "../config/SealClient";
import { packageId, ALLOW_LIST_ID } from "../config/SuiClient";
import { TypeConversion } from "../utilities/typeconversion";

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}


function generateRandomNonce(length = 8): Uint8Array {
  const nonce = new Uint8Array(length);
  crypto.getRandomValues(nonce);
  return nonce;
}

export interface EncryptResult {
  encryptedObject: Uint8Array;
  key: Uint8Array;
  policyIdHex: string; // Seal policy identity for access control
}

export class EncryptionService {
  async encrypt(data: Uint8Array): Promise<EncryptResult> {
    // Convert allowlist ID from hex to bytes for prefix
    const allowlistBytes = TypeConversion.hexToUint8Array(ALLOW_LIST_ID);

    // Generate a random 8-byte nonce for uniqueness
    const nonce = generateRandomNonce(8);

    // Compose Seal key id = allowlist ID bytes + nonce
    const policyIdBytes = concatBytes(allowlistBytes, nonce);

    // Convert policy id to hex string for Seal SDK
    const policyIdHex = TypeConversion.uint8ArrayToHex(policyIdBytes);

    // Call Seal client encrypt with packageId and stripped id
    const { encryptedObject, key } = await sealClient.encrypt({
      threshold: 2,
      packageId,
      id: policyIdHex,
      data,
    });

    if (!encryptedObject || !key) {
      throw new Error("Encryption failed: missing output");
    }
    return { encryptedObject, key, policyIdHex };
  }

  async encryptString(dataString: string) {
    const dataBytes = TypeConversion.stringToUint8Array(dataString);
    const { encryptedObject, key, policyIdHex } = await this.encrypt(dataBytes);

    return {
      encryptedObject,
      key,
      encryptedObjectHex: TypeConversion.uint8ArrayToHex(encryptedObject),
      keyHex: TypeConversion.uint8ArrayToHex(key),
      policyIdHex,
    };
  }

  async encryptFromBase64(dataBase64: string) {
    const dataBytes = TypeConversion.base64ToUint8Array(dataBase64);
    const { encryptedObject, key, policyIdHex } = await this.encrypt(dataBytes);

    return {
      encryptedObject,
      key,
      encryptedObjectHex: TypeConversion.uint8ArrayToHex(encryptedObject),
      keyHex: TypeConversion.uint8ArrayToHex(key),
      policyIdHex,
    };
  }
}

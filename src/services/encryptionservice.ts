import { sealClient } from "../config/SealClient";
import { packageId, ALLOW_LIST_ID } from "../config/SuiClient";
import { TypeConversion } from "../utilities/typeconversion";
import { storeInWalrus } from "./walrusservice";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

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
  policyIdHex: string;
  blobId: string | null;
  blobAddress: string | null;
}

export class EncryptionService {
  private async encrypt(data: Uint8Array): Promise<Pick<EncryptResult, "encryptedObject" | "key" | "policyIdHex">> {
    const allowlistBytes = TypeConversion.hexToUint8Array(ALLOW_LIST_ID);
    const nonce = generateRandomNonce(8);
    const policyIdBytes = concatBytes(allowlistBytes, nonce);
    const policyIdHex = TypeConversion.uint8ArrayToHex(policyIdBytes);

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

  private async encryptAndStore(
    data: Uint8Array,
    userPrivateKey: string,
    epochs: number,
    deletable: boolean
  ): Promise<EncryptResult> {
    const { encryptedObject, key, policyIdHex } = await this.encrypt(data);

    const keypair = Ed25519Keypair.fromSecretKey(userPrivateKey);
    let blobId: string | null = null;
    let blobAddress: string | null = null;

    try {
      blobId = await storeInWalrus({
        encryptedObject: encryptedObject as Uint8Array<ArrayBuffer>,
        deletable,
        epochs,
        signer: keypair,
      });
      blobAddress = `https://aggregator.testnet.walrus.space/v1/${blobId}`;
    } catch (err) {
      console.error("Walrus store failed:", err);
    }

    return { encryptedObject, key, policyIdHex, blobId, blobAddress };
  }

  async encryptStringAndStore(
    dataString: string,
    userPrivateKey: string,
    epochs = 5,
    deletable = false
  ) {
    const dataBytes = TypeConversion.stringToUint8Array(dataString);
    const result = await this.encryptAndStore(dataBytes, userPrivateKey, epochs, deletable);

    return {
      ...result,
      encryptedObjectHex: TypeConversion.uint8ArrayToHex(result.encryptedObject),
      keyHex: TypeConversion.uint8ArrayToHex(result.key),
    };
  }

  async encryptFromBase64AndStore(
    dataBase64: string,
    userPrivateKey: string,
    epochs = 5,
    deletable = false
  ) {
    const dataBytes = TypeConversion.base64ToUint8Array(dataBase64);
    const result = await this.encryptAndStore(dataBytes, userPrivateKey, epochs, deletable);

    return {
      ...result,
      encryptedObjectHex: TypeConversion.uint8ArrayToHex(result.encryptedObject),
      keyHex: TypeConversion.uint8ArrayToHex(result.key),
    };
  }

  async encryptString(dataString: string) {
    const dataBytes = TypeConversion.stringToUint8Array(dataString);
    const { encryptedObject, key, policyIdHex } = await this.encrypt(dataBytes);
    return {
      encryptedObject,
      key,
      policyIdHex,
      encryptedObjectHex: TypeConversion.uint8ArrayToHex(encryptedObject),
      keyHex: TypeConversion.uint8ArrayToHex(key),
      blobId: null,
      blobAddress: null,
    };
  }

  async encryptFromBase64(dataBase64: string) {
    const dataBytes = TypeConversion.base64ToUint8Array(dataBase64);
    const { encryptedObject, key, policyIdHex } = await this.encrypt(dataBytes);
    return {
      encryptedObject,
      key,
      policyIdHex,
      encryptedObjectHex: TypeConversion.uint8ArrayToHex(encryptedObject),
      keyHex: TypeConversion.uint8ArrayToHex(key),
      blobId: null,
      blobAddress: null,
    };
  }
}

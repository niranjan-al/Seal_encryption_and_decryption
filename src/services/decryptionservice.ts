// src/services/decryptionservice.ts
import { SessionKey } from "@mysten/seal";
import { suiClient, packageId, ALLOW_LIST_ID } from "../config/SuiClient";
import { sealClient } from "../config/SealClient";
import { TypeConversion } from "../utilities/typeconversion";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { fetchFromWalrus } from "./walrusservice";

function fromHexString(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function waitForObjectIndexed(objectId: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const obj = await suiClient.getObject({ id: objectId, options: { showContent: true } });
    if (obj.data) return;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Sui object ${objectId} not indexed within ${timeoutMs}ms`);
}

export class DecryptionService {
  async decrypt(
    userAddress: string,
    keypair: Ed25519Keypair,
    encryptedHexString: string,
    keyIdHex: string
  ): Promise<Uint8Array> {
    // Wait until allowlist object is indexed on-chain
    await waitForObjectIndexed(ALLOW_LIST_ID);

    // Convert keyId hex string (policy identity) to Uint8Array
    const policyIdBytes = fromHexString(keyIdHex);
    if (!policyIdBytes) {
      throw new Error("Invalid keyId hex string");
    }

    // Create Seal session key for user
    const sessionKey = await SessionKey.create({
      address: userAddress,
      packageId,
      ttlMin: 10,
      suiClient,
    });

    // User signs the session key personal message
    const personalMessage = sessionKey.getPersonalMessage();
    const { signature } = await keypair.signPersonalMessage(personalMessage);
    sessionKey.setPersonalMessageSignature(signature);

    // Build the Seal PTB calling move contract's seal_approve entry
    const decryptTx = new Transaction();
    decryptTx.moveCall({
      target: `${packageId}::allowlist::seal_approve`,
      arguments: [
        decryptTx.pure.vector("u8", policyIdBytes),
        decryptTx.object(ALLOW_LIST_ID),
      ],
    });

    const txBytes = await decryptTx.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    // Decode encrypted data hex to bytes
    const encryptedData = fromHexString(encryptedHexString);
    if (!encryptedData) {
      throw new Error("Invalid encryptedHexString");
    }

    // Call Seal decrypt passing encrypted data, session, and PTB bytes
    const decryptedBytes = await sealClient.decrypt({
      data: encryptedData,
      sessionKey,
      txBytes,
    });

    return decryptedBytes;
  }

  async decryptFromWalrus(
    userAddress: string,
    userPrivateKey: string,
    blobId: string,
    keyIdHex: string
  ): Promise<Uint8Array> {
    // Create keypair from private key
    const keypair = Ed25519Keypair.fromSecretKey(userPrivateKey);

    // Verify the user address matches the private key
    if (keypair.getPublicKey().toSuiAddress() !== userAddress) {
      throw new Error("User address does not match the provided private key");
    }

    try {
      // Fetch encrypted data from Walrus
      const encryptedDataBytes = await fetchFromWalrus(blobId);
      const encryptedHexString = TypeConversion.uint8ArrayToHex(encryptedDataBytes);

      // Decrypt using existing decrypt method
      return await this.decrypt(userAddress, keypair, encryptedHexString, keyIdHex);
    } catch (error) {
      console.error("Failed to decrypt from Walrus:", error);
      throw new Error(`Decryption from Walrus failed: ${error}`);
    }
  }
}

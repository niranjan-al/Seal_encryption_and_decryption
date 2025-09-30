import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
export declare class DecryptionService {
    decrypt(userAddress: string, keypair: Ed25519Keypair, encryptedHexString: string, keyIdHex: string): Promise<Uint8Array>;
}
//# sourceMappingURL=decryptionservice.d.ts.map
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export class KeypairGeneration {
  static generateKeypair(): Ed25519Keypair {
    return Ed25519Keypair.generate();
  }

  static fromSecretKey(secretKey: string): Ed25519Keypair {
    return Ed25519Keypair.fromSecretKey(secretKey);
  }

  static validateKeypair(keypair: Ed25519Keypair): boolean {
    try {
      const address = keypair.getPublicKey().toSuiAddress();
      return address.length > 0;
    } catch {
      return false;
    }
  }
}
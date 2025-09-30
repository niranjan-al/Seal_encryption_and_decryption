import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
export declare class KeypairGeneration {
    static generateKeypair(): Ed25519Keypair;
    static fromSecretKey(secretKey: string): Ed25519Keypair;
    static validateKeypair(keypair: Ed25519Keypair): boolean;
}
//# sourceMappingURL=keypairgeneration.d.ts.map
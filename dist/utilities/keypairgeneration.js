"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypairGeneration = void 0;
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
class KeypairGeneration {
    static generateKeypair() {
        return ed25519_1.Ed25519Keypair.generate();
    }
    static fromSecretKey(secretKey) {
        return ed25519_1.Ed25519Keypair.fromSecretKey(secretKey);
    }
    static validateKeypair(keypair) {
        try {
            const address = keypair.getPublicKey().toSuiAddress();
            return address.length > 0;
        }
        catch {
            return false;
        }
    }
}
exports.KeypairGeneration = KeypairGeneration;
//# sourceMappingURL=keypairgeneration.js.map
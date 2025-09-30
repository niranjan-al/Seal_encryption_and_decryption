"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const SealClient_1 = require("../config/SealClient");
const SuiClient_1 = require("../config/SuiClient");
const typeconversion_1 = require("../utilities/typeconversion");
function concatBytes(a, b) {
    const result = new Uint8Array(a.length + b.length);
    result.set(a, 0);
    result.set(b, a.length);
    return result;
}
function generateRandomNonce(length = 8) {
    const nonce = new Uint8Array(length);
    crypto.getRandomValues(nonce);
    return nonce;
}
class EncryptionService {
    async encrypt(data) {
        // Convert allowlist ID from hex to bytes for prefix
        const allowlistBytes = typeconversion_1.TypeConversion.hexToUint8Array(SuiClient_1.ALLOW_LIST_ID);
        // Generate a random 8-byte nonce for uniqueness
        const nonce = generateRandomNonce(8);
        // Compose Seal key id = allowlist ID bytes + nonce
        const policyIdBytes = concatBytes(allowlistBytes, nonce);
        // Convert policy id to hex string for Seal SDK
        const policyIdHex = typeconversion_1.TypeConversion.uint8ArrayToHex(policyIdBytes);
        // Call Seal client encrypt with packageId and stripped id
        const { encryptedObject, key } = await SealClient_1.sealClient.encrypt({
            threshold: 2,
            packageId: SuiClient_1.packageId,
            id: policyIdHex,
            data,
        });
        if (!encryptedObject || !key) {
            throw new Error("Encryption failed: missing output");
        }
        return { encryptedObject, key, policyIdHex };
    }
    async encryptString(dataString) {
        const dataBytes = typeconversion_1.TypeConversion.stringToUint8Array(dataString);
        const { encryptedObject, key, policyIdHex } = await this.encrypt(dataBytes);
        return {
            encryptedObject,
            key,
            encryptedObjectHex: typeconversion_1.TypeConversion.uint8ArrayToHex(encryptedObject),
            keyHex: typeconversion_1.TypeConversion.uint8ArrayToHex(key),
            policyIdHex,
        };
    }
    async encryptFromBase64(dataBase64) {
        const dataBytes = typeconversion_1.TypeConversion.base64ToUint8Array(dataBase64);
        const { encryptedObject, key, policyIdHex } = await this.encrypt(dataBytes);
        return {
            encryptedObject,
            key,
            encryptedObjectHex: typeconversion_1.TypeConversion.uint8ArrayToHex(encryptedObject),
            keyHex: typeconversion_1.TypeConversion.uint8ArrayToHex(key),
            policyIdHex,
        };
    }
}
exports.EncryptionService = EncryptionService;
//# sourceMappingURL=encryptionservice.js.map
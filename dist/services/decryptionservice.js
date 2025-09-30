"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecryptionService = void 0;
const seal_1 = require("@mysten/seal");
const SuiClient_1 = require("../config/SuiClient");
const SealClient_1 = require("../config/SealClient");
const transactions_1 = require("@mysten/sui/transactions");
/**
 * Convert hex string to Uint8Array, with optional "0x" handling
 */
function fromHexString(hex) {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
    }
    return bytes;
}
/**
 * Wait for allowlist object to be indexed (simple polling)
 */
async function waitForObjectIndexed(objectId, timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const obj = await SuiClient_1.suiClient.getObject({ id: objectId, options: { showContent: true } });
        if (obj.data)
            return;
        await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error(`Sui object ${objectId} not indexed within ${timeoutMs}ms`);
}
class DecryptionService {
    async decrypt(userAddress, keypair, encryptedHexString, keyIdHex) {
        // Wait until allowlist object is indexed on-chain
        await waitForObjectIndexed(SuiClient_1.ALLOW_LIST_ID);
        // Convert keyId hex string (policy identity) to Uint8Array
        const policyIdBytes = fromHexString(keyIdHex);
        if (!policyIdBytes) {
            throw new Error("Invalid keyId hex string");
        }
        // Create Seal session key for user
        const sessionKey = await seal_1.SessionKey.create({
            address: userAddress,
            packageId: SuiClient_1.packageId,
            ttlMin: 10,
            suiClient: SuiClient_1.suiClient,
        });
        // User signs the session key personal message
        const personalMessage = sessionKey.getPersonalMessage();
        const { signature } = await keypair.signPersonalMessage(personalMessage);
        sessionKey.setPersonalMessageSignature(signature);
        // Build the Seal PTB calling move contract's seal_approve entry
        const decryptTx = new transactions_1.Transaction();
        decryptTx.moveCall({
            target: `${SuiClient_1.packageId}::allowlist::seal_approve`,
            arguments: [
                decryptTx.pure.vector("u8", policyIdBytes),
                decryptTx.object(SuiClient_1.ALLOW_LIST_ID),
            ],
        });
        const txBytes = await decryptTx.build({
            client: SuiClient_1.suiClient,
            onlyTransactionKind: true,
        });
        // Decode encrypted data hex to bytes
        const encryptedData = fromHexString(encryptedHexString);
        if (!encryptedData) {
            throw new Error("Invalid encryptedHexString");
        }
        // Call Seal decrypt passing encrypted data, session, and PTB bytes
        const decryptedBytes = await SealClient_1.sealClient.decrypt({
            data: encryptedData,
            sessionKey,
            txBytes,
        });
        return decryptedBytes;
    }
}
exports.DecryptionService = DecryptionService;
//# sourceMappingURL=decryptionservice.js.map
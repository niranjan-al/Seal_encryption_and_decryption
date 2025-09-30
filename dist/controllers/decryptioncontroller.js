"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecryptionController = void 0;
const decryptionservice_1 = require("../services/decryptionservice");
const decryptiontypes_1 = require("../types/decryptiontypes");
const typeconversion_1 = require("../utilities/typeconversion");
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
const SuiClient_1 = require("../config/SuiClient");
class DecryptionController {
    constructor() {
        this.svc = new decryptionservice_1.DecryptionService();
    }
    /**
     * POST /api/decrypt-data
     * Body: { userAddress: string, privateKey: string, encryptedHexString: string, keyHex: string }
     */
    async decryptData(req, res) {
        const start = Date.now();
        try {
            const { userAddress, privateKey, encryptedHexString, keyHex } = req.body;
            if (!userAddress || !privateKey || !encryptedHexString || !keyHex) {
                const errorResponse = {
                    success: false,
                    decryptedData: null,
                    decryptedDataHex: null,
                    decryptedText: null,
                    timestamp: null,
                    ownerAddress: null,
                    allowlistObjectId: null,
                    processingTimeMs: null,
                    error: "Missing required fields: userAddress, privateKey, encryptedHexString, keyHex",
                    errorCode: decryptiontypes_1.ErrorCodes.INVALID_INPUT,
                };
                res.status(400).json(errorResponse);
                return;
            }
            if (typeof userAddress !== "string" ||
                typeof privateKey !== "string" ||
                typeof encryptedHexString !== "string" ||
                typeof keyHex !== "string") {
                const errorResponse = {
                    success: false,
                    decryptedData: null,
                    decryptedDataHex: null,
                    decryptedText: null,
                    timestamp: null,
                    ownerAddress: null,
                    allowlistObjectId: null,
                    processingTimeMs: null,
                    error: "All fields must be strings",
                    errorCode: decryptiontypes_1.ErrorCodes.INVALID_INPUT,
                };
                res.status(400).json(errorResponse);
                return;
            }
            // create keypair from privateKey string
            let keypair;
            try {
                keypair = ed25519_1.Ed25519Keypair.fromSecretKey(privateKey);
            }
            catch (err) {
                const errorResponse = {
                    success: false,
                    decryptedData: null,
                    decryptedDataHex: null,
                    decryptedText: null,
                    timestamp: null,
                    ownerAddress: null,
                    allowlistObjectId: null,
                    processingTimeMs: null,
                    error: "Invalid private key format",
                    errorCode: decryptiontypes_1.ErrorCodes.INVALID_INPUT,
                };
                res.status(400).json(errorResponse);
                return;
            }
            // Verify userAddress matches private key
            const derivedAddress = keypair.getPublicKey().toSuiAddress();
            if (derivedAddress !== userAddress) {
                const errorResponse = {
                    success: false,
                    decryptedData: null,
                    decryptedDataHex: null,
                    decryptedText: null,
                    timestamp: null,
                    ownerAddress: null,
                    allowlistObjectId: null,
                    processingTimeMs: null,
                    error: "User address does not match the provided private key",
                    errorCode: decryptiontypes_1.ErrorCodes.INVALID_INPUT,
                };
                res.status(400).json(errorResponse);
                return;
            }
            // decrypt using service
            const decryptedBytes = await this.svc.decrypt(userAddress, keypair, encryptedHexString, keyHex);
            const durationMs = Date.now() - start;
            const timestamp = new Date().toISOString();
            const decryptedDataBase64 = typeconversion_1.TypeConversion.uint8ArrayToBase64(decryptedBytes);
            const decryptedDataHex = typeconversion_1.TypeConversion.uint8ArrayToHex(decryptedBytes);
            const decryptedText = typeconversion_1.TypeConversion.uint8ArrayToString(decryptedBytes);
            const successResponse = {
                success: true,
                timestamp,
                ownerAddress: userAddress,
                allowlistObjectId: SuiClient_1.ALLOW_LIST_ID,
                processingTimeMs: durationMs,
                decryptedData: decryptedDataBase64,
                decryptedDataHex,
                decryptedText,
                error: null,
                errorCode: null,
            };
            res.json(successResponse);
        }
        catch (e) {
            console.error("Decryption Controller Error:", e);
            let status = 500;
            let code = decryptiontypes_1.ErrorCodes.DECRYPTION_ERROR;
            let msg = e.message || "Decryption failed";
            if (e instanceof decryptiontypes_1.DecryptionError) {
                status = e.statusCode;
                code = e.errorCode;
            }
            else if (e.message?.includes("session key") || e.message?.includes("signature")) {
                status = 401;
                code = decryptiontypes_1.ErrorCodes.INVALID_SESSION;
            }
            else if (e.message?.includes("access") || e.message?.includes("policy") || e.message?.includes("allowlist")) {
                status = 403;
                code = decryptiontypes_1.ErrorCodes.NO_ACCESS;
            }
            else if (e.message?.includes("keyId") || e.message?.includes("Key ID") || e.message?.includes("generating keyId")) {
                status = 400;
                code = decryptiontypes_1.ErrorCodes.KEY_GENERATION_ERROR;
            }
            else if (e.message?.includes("private key") || e.message?.includes("keypair")) {
                status = 400;
                code = decryptiontypes_1.ErrorCodes.INVALID_INPUT;
            }
            const errorResponse = {
                success: false,
                decryptedData: null,
                decryptedDataHex: null,
                decryptedText: null,
                timestamp: null,
                ownerAddress: null,
                allowlistObjectId: null,
                processingTimeMs: null,
                error: msg,
                errorCode: code,
            };
            res.status(status).json(errorResponse);
        }
    }
}
exports.DecryptionController = DecryptionController;
//# sourceMappingURL=decryptioncontroller.js.map
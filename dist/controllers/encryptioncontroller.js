"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionController = void 0;
const encryptionservice_1 = require("../services/encryptionservice");
const encryption_types_1 = require("../types/encryption.types");
const typeconversion_1 = require("../utilities/typeconversion");
class EncryptionController {
    constructor() {
        this.svc = new encryptionservice_1.EncryptionService();
    }
    async encryptData(req, res) {
        const { data, inputType = "string" } = req.body;
        if (!data || typeof data !== "string") {
            res.status(400).json({
                success: false,
                encryptedData: null,
                encryptedDataHex: null,
                key: null,
                keyHex: null,
                policyIdHex: null,
                error: "Missing or invalid field: data",
                errorCode: encryption_types_1.ErrorCodes.INVALID_INPUT,
            });
            return;
        }
        let result;
        try {
            const { data, inputType = "string" } = req.body;
            if (!data || typeof data !== "string") {
                res.status(400).json({
                    success: false,
                    encryptedData: null,
                    encryptedDataHex: null,
                    key: null,
                    keyHex: null,
                    policyIdHex: null,
                    error: "Missing or invalid field: data",
                    errorCode: encryption_types_1.ErrorCodes.INVALID_INPUT,
                });
                return;
            }
            let result;
            if (inputType === "base64") {
                result = await this.svc.encryptFromBase64(data);
            }
            else {
                result = await this.svc.encryptString(data);
            }
            const encryptedDataBase64 = typeconversion_1.TypeConversion.uint8ArrayToBase64(result.encryptedObject);
            const keyBase64 = typeconversion_1.TypeConversion.uint8ArrayToBase64(result.key);
            res.json({
                success: true,
                encryptedData: encryptedDataBase64,
                encryptedDataHex: result.encryptedObjectHex,
                key: keyBase64,
                keyHex: result.keyHex,
                policyIdHex: result.policyIdHex, // Return policy ID for decryption use
                error: null,
                errorCode: null,
            });
        }
        catch (e) {
            console.error("Encryption Controller Error:", e);
            let status = 500;
            let code = encryption_types_1.ErrorCodes.ENCRYPTION_ERROR;
            let msg = e.message || "Encryption failed";
            if (e instanceof encryption_types_1.EncryptionError) {
                status = e.statusCode;
                code = e.errorCode;
            }
            res.status(status).json({
                success: false,
                encryptedData: null,
                encryptedDataHex: null,
                key: null,
                keyHex: null,
                policyIdHex: null,
                error: msg,
                errorCode: code,
            });
        }
    }
}
exports.EncryptionController = EncryptionController;
//# sourceMappingURL=encryptioncontroller.js.map
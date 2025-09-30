import { Request, Response } from "express";
import { EncryptionService } from "../services/encryptionservice";
import { ApiResponse, ErrorCodes, EncryptionError } from "../types/encryption.types";
import { TypeConversion } from "../utilities/typeconversion";

export class EncryptionController {
  private svc = new EncryptionService();

  async encryptData(req: Request, res: Response): Promise<void> {
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
        errorCode: ErrorCodes.INVALID_INPUT,
      } as ApiResponse);
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
          errorCode: ErrorCodes.INVALID_INPUT,
        });
        return;
      }

      let result;
      if (inputType === "base64") {
        result = await this.svc.encryptFromBase64(data);
      } else {
        result = await this.svc.encryptString(data);
      }

      const encryptedDataBase64 = TypeConversion.uint8ArrayToBase64(result.encryptedObject);
      const keyBase64 = TypeConversion.uint8ArrayToBase64(result.key);

      res.json({
        success: true,
        encryptedData: encryptedDataBase64,
        encryptedDataHex: result.encryptedObjectHex,
        key: keyBase64,
        keyHex: result.keyHex,
        policyIdHex: result.policyIdHex, // Return policy ID for decryption use
        error: null,
        errorCode: null,
      } as ApiResponse);
    } catch (e: any) {
      console.error("Encryption Controller Error:", e);

      let status = 500;
      let code = ErrorCodes.ENCRYPTION_ERROR;
      let msg = e.message || "Encryption failed";

      if (e instanceof EncryptionError) {
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
      } as ApiResponse);
    }
  }
}

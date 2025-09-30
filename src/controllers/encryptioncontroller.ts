import { Request, Response } from "express";
import { EncryptionService } from "../services/encryptionservice";
import { ApiResponse, ErrorCodes, EncryptionError } from "../types/encryption.types";
import { TypeConversion } from "../utilities/typeconversion";
import { db } from "../config/database/db";
import { encryptionRecords } from "../config/database/schema";

export class EncryptionController {
  private svc = new EncryptionService();

  async encryptData(req: Request, res: Response): Promise<void> {
    try {
      const { data, inputType = "string" } = req.body;

      if (!data || typeof data !== "string") {
        res.status(400).json({
          success: false,
          encryptedDataHex: null,
          policyIdHex: null,
          error: "Missing or invalid field: data",
          errorCode: ErrorCodes.INVALID_INPUT,
        } as ApiResponse);
        return;
      }

      const result = inputType === "base64"
        ? await this.svc.encryptFromBase64(data)
        : await this.svc.encryptString(data);

      await db.insert(encryptionRecords).values({
        data,
        encryptedDataHex: result.encryptedObjectHex,
        keyHex: result.keyHex,
        policyIdHex: result.policyIdHex,
        ownerAddress: "unknown",
      }).catch(console.error);

      res.json({
        success: true,
        encryptedDataHex: result.encryptedObjectHex,
        policyIdHex: result.policyIdHex,
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
        encryptedDataHex: null,
        policyIdHex: null,
        error: msg,
        errorCode: code,
      } as ApiResponse);
    }
  }
}

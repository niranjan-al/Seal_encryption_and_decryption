// src/controllers/encryptioncontroller.ts
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
      const { 
        data, 
        inputType = "string", 
        userPrivateKey,
        storeInWalrus = true,
        epochs = 5,
        deletable = false 
      } = req.body;

      if (!data || typeof data !== "string") {
        res.status(400).json({
          success: false,
          encryptedDataHex: null,
          policyIdHex: null,
          blobId: null,
          blobAddress: null,
          error: "Missing or invalid field: data",
          errorCode: ErrorCodes.INVALID_INPUT,
        } as ApiResponse);
        return;
      }

      if (storeInWalrus && (!userPrivateKey || typeof userPrivateKey !== "string")) {
        res.status(400).json({
          success: false,
          encryptedDataHex: null,
          policyIdHex: null,
          blobId: null,
          blobAddress: null,
          error: "userPrivateKey is required when storeInWalrus is true",
          errorCode: ErrorCodes.INVALID_INPUT,
        } as ApiResponse);
        return;
      }

      let result;
      
      if (storeInWalrus) {
        // Encrypt and store in Walrus
        result = inputType === "base64"
          ? await this.svc.encryptFromBase64AndStore(data, userPrivateKey, epochs, deletable)
          : await this.svc.encryptStringAndStore(data, userPrivateKey, epochs, deletable);
      } else {
        // Encrypt only (existing functionality)
        result = inputType === "base64"
          ? await this.svc.encryptFromBase64(data)
          : await this.svc.encryptString(data);
      }

      res.json({
        success: true,
        encryptedDataHex: result.encryptedObjectHex,
        policyIdHex: result.policyIdHex,
        blobId: result.blobId || null,
        blobAddress: result.blobAddress || null,
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
        blobId: null,
        blobAddress: null,
        error: msg,
        errorCode: code,
      } as ApiResponse);
    }
  }
}

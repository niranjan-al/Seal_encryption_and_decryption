import { Request, Response } from "express";
import { DecryptionService } from "../services/decryptionservice";
import { ApiResponse, ErrorCodes, DecryptionError } from "../types/decryptiontypes";
import { TypeConversion } from "../utilities/typeconversion";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { ALLOW_LIST_ID } from "../config/SuiClient";
import { db } from "../config/database/db";
import { decryptionRecords } from "../config/database/schema";

export class DecryptionController {
  private svc = new DecryptionService();

  async decryptData(req: Request, res: Response): Promise<void> {
    const start = Date.now();

    try {
      const { userAddress, privateKey, encryptedHexString, keyHex } = req.body;

      if (!userAddress || !privateKey || !encryptedHexString || !keyHex) {
        res.status(400).json({
          success: false,
          decryptedData: null,
          decryptedDataHex: null,
          decryptedText: null,
          timestamp: null,
          ownerAddress: null,
          allowlistObjectId: null,
          processingTimeMs: null,
          error: "Missing required fields: userAddress, privateKey, encryptedHexString, keyHex",
          errorCode: ErrorCodes.INVALID_INPUT,
        } as ApiResponse);
        return;
      }

      if (
        typeof userAddress !== "string" ||
        typeof privateKey !== "string" ||
        typeof encryptedHexString !== "string" ||
        typeof keyHex !== "string"
      ) {
        res.status(400).json({
          success: false,
          decryptedData: null,
          decryptedDataHex: null,
          decryptedText: null,
          timestamp: null,
          ownerAddress: null,
          allowlistObjectId: null,
          processingTimeMs: null,
          error: "All fields must be strings",
          errorCode: ErrorCodes.INVALID_INPUT,
        } as ApiResponse);
        return;
      }

      let keypair: Ed25519Keypair;
      try {
        keypair = Ed25519Keypair.fromSecretKey(privateKey);
      } catch {
        res.status(400).json({
          success: false,
          decryptedData: null,
          decryptedDataHex: null,
          decryptedText: null,
          timestamp: null,
          ownerAddress: null,
          allowlistObjectId: null,
          processingTimeMs: null,
          error: "Invalid private key format",
          errorCode: ErrorCodes.INVALID_INPUT,
        } as ApiResponse);
        return;
      }

      if (keypair.getPublicKey().toSuiAddress() !== userAddress) {
        res.status(400).json({
          success: false,
          decryptedData: null,
          decryptedDataHex: null,
          decryptedText: null,
          timestamp: null,
          ownerAddress: null,
          allowlistObjectId: null,
          processingTimeMs: null,
          error: "User address does not match the provided private key",
          errorCode: ErrorCodes.INVALID_INPUT,
        } as ApiResponse);
        return;
      }

      const decryptedBytes = await this.svc.decrypt(
        userAddress,
        keypair,
        encryptedHexString,
        keyHex
      );

      const durationMs = Date.now() - start;
      const timestamp = new Date().toISOString();
      const decryptedDataBase64 = TypeConversion.uint8ArrayToBase64(decryptedBytes);
      const decryptedDataHex = TypeConversion.uint8ArrayToHex(decryptedBytes);
      const decryptedText = TypeConversion.uint8ArrayToString(decryptedBytes);

      db.insert(decryptionRecords)
        .values({
          ownerAddress: userAddress,
          decryptedData: decryptedDataBase64,
          decryptedDataHex,
          allowlistObjectId: ALLOW_LIST_ID,
          processingTimeMs: durationMs.toString(),
        })
        .catch(console.error);

      res.json({
        success: true,
        timestamp,
        ownerAddress: userAddress,
        allowlistObjectId: ALLOW_LIST_ID,
        processingTimeMs: durationMs,
        decryptedData: decryptedDataBase64,
        decryptedDataHex,
        decryptedText,
        error: null,
        errorCode: null,
      } as ApiResponse);
    } catch (e: any) {
      console.error("Decryption Controller Error:", e);

      let status = 500;
      let code = ErrorCodes.DECRYPTION_ERROR;
      let msg = e.message || "Decryption failed";

      if (e instanceof DecryptionError) {
        status = e.statusCode;
        code = e.errorCode;
      } else if (e.message.includes("session key") || e.message.includes("signature")) {
        status = 401;
        code = ErrorCodes.INVALID_SESSION;
      } else if (e.message.includes("access") || e.message.includes("policy")) {
        status = 403;
        code = ErrorCodes.NO_ACCESS;
      } else if (e.message.includes("keyId")) {
        status = 400;
        code = ErrorCodes.KEY_GENERATION_ERROR;
      } else if (e.message.includes("private key")) {
        status = 400;
        code = ErrorCodes.INVALID_INPUT;
      }

      res.status(status).json({
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
      } as ApiResponse);
    }
  }
}

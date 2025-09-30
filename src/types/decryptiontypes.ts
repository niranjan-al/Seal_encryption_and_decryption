export interface DecryptRequest {
  userAddress: string;
  privateKey: string;
  encryptedHexString: string;
  keyHex: string;
}

export interface DecryptResult {
  decryptedData: Uint8Array;
}

export interface ApiResponse {
  success: boolean;
  decryptedData?: string | null;
  decryptedDataHex?: string | null;
  decryptedText?: string | null;
  timestamp?: string | null;
  ownerAddress?: string | null;
  allowlistObjectId?: string | null;
  processingTimeMs?: number | null;
  error?: string | null;
  errorCode?: string | null;
}

export enum ErrorCodes {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_SESSION = 'INVALID_SESSION',
  NO_ACCESS = 'NO_ACCESS',
  DECRYPTION_ERROR = 'DECRYPTION_ERROR',
  MISSING_CONFIG = 'MISSING_CONFIG',
  KEY_GENERATION_ERROR = 'KEY_GENERATION_ERROR'
}

export class DecryptionError extends Error {
  constructor(
    message: string,
    public errorCode: ErrorCodes,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'DecryptionError';
  }
}
export interface EncryptResult {
  encryptedObject: Uint8Array;
  key: Uint8Array;
}

export interface ApiResponse {
  success: boolean;
  encryptedData?: string | null;
  encryptedDataHex?: string | null;
  key?: string | null;
  keyHex?: string | null;
  policyIdHex?: string | null;
  error?: string | null;
  errorCode?: string | null;
}


export enum ErrorCodes {
  INVALID_INPUT = 'INVALID_INPUT',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  MISSING_CONFIG = 'MISSING_CONFIG'
}

export class EncryptionError extends Error {
  constructor(
    message: string,
    public errorCode: ErrorCodes,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'EncryptionError';
  }
}
export interface ApiError {
  success: false;
  decryptedData: null;
  decryptedText: null;
  error: string;
  errorCode: string;
}

export interface ApiSuccess {
  success: true;
  decryptedData: string;
  decryptedText: string;
  error: null;
  errorCode: null;
}

export type ApiResponse = ApiSuccess | ApiError;

export enum ErrorCodes {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_SESSION = 'INVALID_SESSION', 
  NO_ACCESS = 'NO_ACCESS',
  DECRYPTION_ERROR = 'DECRYPTION_ERROR',
  MISSING_SIGNER_KEY = 'MISSING_SIGNER_KEY'
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
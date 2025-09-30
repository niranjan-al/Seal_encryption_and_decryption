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
    error?: string | null;
    errorCode?: string | null;
}
export declare enum ErrorCodes {
    INVALID_INPUT = "INVALID_INPUT",
    ENCRYPTION_ERROR = "ENCRYPTION_ERROR",
    MISSING_CONFIG = "MISSING_CONFIG"
}
export declare class EncryptionError extends Error {
    errorCode: ErrorCodes;
    statusCode: number;
    constructor(message: string, errorCode: ErrorCodes, statusCode?: number);
}
//# sourceMappingURL=encryption.types.d.ts.map
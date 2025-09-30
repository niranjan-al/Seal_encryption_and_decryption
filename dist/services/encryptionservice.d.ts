export interface EncryptResult {
    encryptedObject: Uint8Array;
    key: Uint8Array;
    policyIdHex: string;
}
export declare class EncryptionService {
    encrypt(data: Uint8Array): Promise<EncryptResult>;
    encryptString(dataString: string): Promise<{
        encryptedObject: Uint8Array<ArrayBufferLike>;
        key: Uint8Array<ArrayBufferLike>;
        encryptedObjectHex: string;
        keyHex: string;
        policyIdHex: string;
    }>;
    encryptFromBase64(dataBase64: string): Promise<{
        encryptedObject: Uint8Array<ArrayBufferLike>;
        key: Uint8Array<ArrayBufferLike>;
        encryptedObjectHex: string;
        keyHex: string;
        policyIdHex: string;
    }>;
}
//# sourceMappingURL=encryptionservice.d.ts.map
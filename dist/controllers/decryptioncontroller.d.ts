import { Request, Response } from "express";
export declare class DecryptionController {
    private svc;
    /**
     * POST /api/decrypt-data
     * Body: { userAddress: string, privateKey: string, encryptedHexString: string, keyHex: string }
     */
    decryptData(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=decryptioncontroller.d.ts.map
import { Signer } from "@mysten/sui/dist/cjs/cryptography";;

export interface WriteBlobParams {
  encryptedObject: Uint8Array<ArrayBufferLike>;  
  deletable: boolean;           
  epochs: number;               
  signer: Signer;      
}


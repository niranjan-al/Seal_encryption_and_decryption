import { WalrusBlob } from "@mysten/walrus";
import { walrusClient } from "../config/walrusclient";
import { WriteBlobParams } from "../types/walrustypes";

export async function storeInWalrus(
  blobOptions: WriteBlobParams
): Promise<string> {
  const { encryptedObject, deletable, epochs, signer } = blobOptions;
  try {
    const { blobId } = await walrusClient.writeBlob({
      blob: encryptedObject,
      deletable,
      epochs,
      signer,
    });
    return blobId;
  } catch (error) {
    console.error("Error in walrus storing service: ", error);
    throw error;
  }
}

export async function fetchFromWalrus(
  blobId: string
): Promise<Uint8Array> {
  try {
    const blobObject: WalrusBlob = await walrusClient.getBlob({ blobId });
    if (!blobObject) {
      throw new Error("Error fetching blob from Walrus, no blobObject returned");
    }
    const blobBytes = blobObject.asFile().bytes();
    if (!blobBytes) {
      throw new Error("Error fetching blob bytes from Walrus");
    }
    return blobBytes;
  } catch (error: any) {
    if (typeof error === "string" && error.includes("Enough slivers successfully retrieved.")) {
      console.warn("Walrus internal 'Enough slivers successfully retrieved.' message treated as success");
      return new Uint8Array();  // Return empty bytes or handle accordingly
    }
    console.error("Error in walrus data retrieving service: ", error);
    throw error;
  }
}





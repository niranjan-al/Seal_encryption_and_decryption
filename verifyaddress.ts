import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

function verifyKeypairMatchesAddress(privateKeyString: string, expectedAddress: string): boolean {
  try {
    const keypair = Ed25519Keypair.fromSecretKey(privateKeyString);
    const derivedAddress = keypair.getPublicKey().toSuiAddress();
    return derivedAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (e) {
    console.error("Invalid private key or error:", e);
    return false;
  }
}

// Usage
const privateKey = "suiprivkey1qzl356yx7tfh9z0gw8ywjh3y5fm8xrstkk7utnkn487kffurj6kx23lgznx";
const address = "0x66b4c02eaf2d678e056f41c871ccbd429741e9530d451cbd8ab7e7ff2187d0e0";

if (verifyKeypairMatchesAddress(privateKey, address)) {
  console.log("Keypair and address match");
} else {
  console.log("Mismatch between keypair and address");
}

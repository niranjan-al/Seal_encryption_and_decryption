import { WalrusClient } from "@mysten/walrus";
import { suiClient } from "./SuiClient";
import { robustFetch } from "./walrus.fetch.wrapper";

export const walrusClient = new WalrusClient({
  network: "testnet",
  suiClient,
  storageNodeClientOptions: {
    timeout: 120_000,
    onError: (error) => {
      console.error("Walrus Storage Node Client Error:", error);
    },
    fetch: robustFetch as any,
  },
  wasmUrl:
    "https://unpkg.com/@mysten/walrus-wasm@latest/web/walrus_wasm_bg.wasm",
  uploadRelay: {
    host: "https://upload-relay.testnet.walrus.space",
    sendTip: {
      max: 200,   
    },
  },
});

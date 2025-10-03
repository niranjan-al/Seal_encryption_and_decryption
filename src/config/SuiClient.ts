import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import dotenv from "dotenv";


dotenv.config();
const SUI_TESTNET = process.env.SUI_TESTNET_RPC_URL!;
export const suiClient = new SuiClient({
  url: SUI_TESTNET,
  network: "testnet",
});

export const packageId = process.env.PACKAGE_ID!;
export const ALLOW_LIST_ID = process.env.ALLOW_LIST_ID!;
export const MODULE_NAME = process.env.MODULE_NAME!;

import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import dotenv from "dotenv";

dotenv.config();

const network = (process.env.SUI_NETWORK as "testnet" | "mainnet") || "testnet";
const rpcUrl  = getFullnodeUrl(network);

export const suiClient = new SuiClient({ url: rpcUrl });

export const packageId = process.env.PACKAGE_ID!;
export const ALLOW_LIST_ID = process.env.ALLOW_LIST_ID!;
export const MODULE_NAME = process.env.MODULE_NAME!;

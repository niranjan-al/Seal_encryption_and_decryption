import { SealClient } from "@mysten/seal";
import dotenv from "dotenv";
import { suiClient } from "./SuiClient";
dotenv.config();
const serverObjectIds = [
  process.env.KEY_SERVER_OBJECT_ID_1!,
  process.env.KEY_SERVER_OBJECT_ID_2!,
];
export const sealClient = new SealClient({
  suiClient,
  serverConfigs: serverObjectIds.map((id) => ({
    objectId: id,
    weight: 1,
  })),
  verifyKeyServers: false,
  timeout: 60_000,
});
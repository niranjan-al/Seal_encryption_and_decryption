import { SealClient } from "@mysten/seal";
import { suiClient } from "./SuiClient";
import dotenv from "dotenv";

dotenv.config();


export const accessPolicyId = process.env.ACCESS_POLICY_ID!;

const serverConfigs = [
  {
    objectId: process.env.KEY_SERVER_OBJECT_ID_1!,
    weight: 1,
  },
  {
    objectId: process.env.KEY_SERVER_OBJECT_ID_2!,
    weight: 1,
  },
];

export const sealClient = new SealClient({
  suiClient,
  serverConfigs,
  verifyKeyServers: true,
});

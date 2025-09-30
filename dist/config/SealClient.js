"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sealClient = exports.accessPolicyId = void 0;
const seal_1 = require("@mysten/seal");
const SuiClient_1 = require("./SuiClient");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.accessPolicyId = process.env.ACCESS_POLICY_ID;
const serverConfigs = [
    {
        objectId: process.env.KEY_SERVER_OBJECT_ID_1,
        weight: 1,
    },
    {
        objectId: process.env.KEY_SERVER_OBJECT_ID_2,
        weight: 1,
    },
];
exports.sealClient = new seal_1.SealClient({
    suiClient: SuiClient_1.suiClient,
    serverConfigs,
    verifyKeyServers: true,
});
//# sourceMappingURL=SealClient.js.map
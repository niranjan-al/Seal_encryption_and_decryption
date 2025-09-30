"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_NAME = exports.ALLOW_LIST_ID = exports.packageId = exports.suiClient = void 0;
const client_1 = require("@mysten/sui/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const network = process.env.SUI_NETWORK || "testnet";
const rpcUrl = (0, client_1.getFullnodeUrl)(network);
exports.suiClient = new client_1.SuiClient({ url: rpcUrl });
exports.packageId = process.env.PACKAGE_ID;
exports.ALLOW_LIST_ID = process.env.ALLOW_LIST_ID;
exports.MODULE_NAME = process.env.MODULE_NAME;
//# sourceMappingURL=SuiClient.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SERVICE_CONFIG = {
    PACKAGE_ID: process.env.PACKAGE_ID,
    MODULE_NAME: process.env.MODULE_NAME,
    SUI_NETWORK: process.env.SUI_NETWORK || 'testnet',
    KEY_SERVERS: [
        {
            objectId: process.env.KEY_SERVER_OBJECT_ID_1,
            url: process.env.KEY_SERVER_URL_1,
            weight: 1,
        },
        {
            objectId: process.env.KEY_SERVER_OBJECT_ID_2,
            url: process.env.KEY_SERVER_URL_2,
            weight: 1,
        }
    ]
};
//# sourceMappingURL=serviceconfigs.js.map
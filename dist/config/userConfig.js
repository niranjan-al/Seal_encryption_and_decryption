"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowlistId = exports.moduleName = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.moduleName = process.env.MODULE_NAME;
exports.allowlistId = process.env.ALLOWLIST_ID || process.env.PACKAGE_ID;
//# sourceMappingURL=userConfig.js.map
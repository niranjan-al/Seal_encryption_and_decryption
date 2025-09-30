"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeConversion = void 0;
const bcs_1 = require("@mysten/bcs");
class TypeConversion {
    static base64ToUint8Array(base64) {
        return (0, bcs_1.fromBase64)(base64);
    }
    static uint8ArrayToBase64(data) {
        return (0, bcs_1.toBase64)(data);
    }
    static hexToUint8Array(hex) {
        return (0, bcs_1.fromHex)(hex);
    }
    static uint8ArrayToHex(data) {
        return (0, bcs_1.toHex)(data);
    }
    static stringToUint8Array(str) {
        return new TextEncoder().encode(str);
    }
    static uint8ArrayToString(data) {
        return new TextDecoder().decode(data);
    }
}
exports.TypeConversion = TypeConversion;
//# sourceMappingURL=typeconversion.js.map
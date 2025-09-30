"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromHexString = fromHexString;
const bcs_1 = require("@mysten/bcs");
function fromHexString(hexString) {
    const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    return (0, bcs_1.fromHex)(cleanHex);
}
//# sourceMappingURL=decryptionutilities.js.map
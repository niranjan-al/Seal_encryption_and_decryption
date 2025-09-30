"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecryptionError = exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCodes["INVALID_SESSION"] = "INVALID_SESSION";
    ErrorCodes["NO_ACCESS"] = "NO_ACCESS";
    ErrorCodes["DECRYPTION_ERROR"] = "DECRYPTION_ERROR";
    ErrorCodes["MISSING_CONFIG"] = "MISSING_CONFIG";
    ErrorCodes["KEY_GENERATION_ERROR"] = "KEY_GENERATION_ERROR";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
class DecryptionError extends Error {
    constructor(message, errorCode, statusCode = 500) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.name = 'DecryptionError';
    }
}
exports.DecryptionError = DecryptionError;
//# sourceMappingURL=decryptiontypes.js.map
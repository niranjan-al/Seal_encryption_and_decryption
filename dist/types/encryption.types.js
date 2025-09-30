"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionError = exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCodes["ENCRYPTION_ERROR"] = "ENCRYPTION_ERROR";
    ErrorCodes["MISSING_CONFIG"] = "MISSING_CONFIG";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
class EncryptionError extends Error {
    constructor(message, errorCode, statusCode = 500) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.name = 'EncryptionError';
    }
}
exports.EncryptionError = EncryptionError;
//# sourceMappingURL=encryption.types.js.map
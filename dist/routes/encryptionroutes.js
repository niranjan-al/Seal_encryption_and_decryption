"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const encryptioncontroller_1 = require("../controllers/encryptioncontroller");
const router = express_1.default.Router();
const controller = new encryptioncontroller_1.EncryptionController();
router.post('/encrypt-data', controller.encryptData.bind(controller));
exports.default = router;
//# sourceMappingURL=encryptionroutes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const decryptioncontroller_1 = require("../controllers/decryptioncontroller");
const router = express_1.default.Router();
const controller = new decryptioncontroller_1.DecryptionController();
router.post('/decrypt-data', controller.decryptData.bind(controller));
exports.default = router;
//# sourceMappingURL=decryptionroutes.js.map
import express from 'express';
import { EncryptionController } from '../controllers/encryptioncontroller';

const router = express.Router();
const controller = new EncryptionController();


router.post('/encrypt-data', controller.encryptData.bind(controller));



export default router;
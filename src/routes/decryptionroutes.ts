import express from 'express';
import { DecryptionController } from '../controllers/decryptioncontroller';

const router = express.Router();
const controller = new DecryptionController();

router.post('/decrypt-data', controller.decryptData.bind(controller));

export default router;

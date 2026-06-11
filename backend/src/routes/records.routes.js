import express from 'express';
import { recordsController } from '../controllers/records.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/records', authMiddleware, recordsController.getRecords);
router.get('/records/:id', authMiddleware, recordsController.getRecordsById);

router.post('/records', authMiddleware, recordsController.createRecord);
router.patch('/records', authMiddleware, recordsController.updateRecord);
router.patch('/records/:id', authMiddleware, recordsController.updateRecord);
router.delete('/records/:id', authMiddleware, recordsController.deleteRecord);

export default router;
import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {habitsCountControllers} from "../controllers/habitsCount.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/', habitsCountControllers.getStats);
router.post('/', habitsControllers.createHabit);
router.delete('/:id', habitsControllers.deleteHabit);

export default router;
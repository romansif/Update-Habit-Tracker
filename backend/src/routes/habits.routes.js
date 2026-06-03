import express from 'express';
import { habitsControllers } from '../controllers/habits.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/habits', habitsControllers.getHabits);
router.post('/habits', habitsControllers.createHabit);
router.delete('/habits/:id', habitsControllers.deleteHabit);

export default router;
import express from 'express';
import { habitsController } from '../controllers/habits.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validation } from "../middleware/validation.js";

const router = express.Router();

router.get('/habits-count/:id', authMiddleware, habitsController.getCount);
router.post('/habits-count', habitsController.createCount);
router.patch('/habits-count/:id', authMiddleware, habitsController.updateCount);
router.delete('/habits-count/:id', authMiddleware, habitsController.deleteCount);

router.get('/habits', authMiddleware, habitsController.getHabits);
router.get('/habits', authMiddleware, habitsController.getFilteredHabits);
router.get('/habits', authMiddleware, habitsController.getSearchedHabits);
router.get('/habits/filtered', authMiddleware, habitsController.getFilteredHabits);
router.get('/habits/:id', authMiddleware, habitsController.getHabitById);

router.post('/habits', authMiddleware, validation.habitValidation, validation.handleValidationErrors, habitsController.createHabit);
router.patch('/habits/:id', authMiddleware, habitsController.updateHabit);
router.delete('/habits/:id', authMiddleware, habitsController.deleteHabit);

export default router;
import { habitsService } from '../services/habits.service.js';

export const habitsControllers = {
    async getHabits (req, res, next) {
        try {
            const habits = habitsService.getAllHabits(req.user.userId);
            res.json(habits);
        } catch (error) { next(error); }
    },

    async createHabit (req, res, next) {
        try {
            const { title, description, frequency } = req.body;
            if (!title) return res.status(400).json({ message: 'Название привычки обязательно' });
            const habit = habitsService.createHabit(req.user.userId, { title, description, frequency });
            res.status(201).json(habit);
        } catch (error) { next(error); }
    },

    async deleteHabit (req, res, next) {
        try {
            const { id } = req.params;
            const success = habitsService.deleteHabit(req.user.userId, id);
            if (!success) return res.status(404).json({ message: 'Привычка не найдена' });
            res.json({ message: 'Привычка успешно удалена' });
        } catch (error) { next(error); }
    },
}

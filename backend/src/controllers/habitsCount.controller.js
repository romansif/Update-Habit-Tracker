import { habitsCountService } from '../services/habitsCount.service.js';

export const habitsCountControllers = {
    async getStats (req, res, next) {
        try {
            const stats = habitsCountService.getUserStats(req.user.userId);
            res.json(stats);
        } catch (error) { next(error); }
    },
}

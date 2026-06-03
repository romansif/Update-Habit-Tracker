import { readDB } from './db.service.js';

export const habitsCountService = {
    getUserStats (userId) {
        const db = readDB();
        const userHabits = db.habits.filter(h => h.userId === userId);
        const habitIds = userHabits.map(h => h.id);
        const totalRecords = db.records.filter(r => habitIds.includes(r.habitId));
        const completedCount = totalRecords.filter(r => r.status === 'completed').length;

        return {
            totalHabits: userHabits.length,
            totalRecords: totalRecords.length,
            completedRecords: completedCount
        };
    },

    createUserStats (userId) {

    }
}

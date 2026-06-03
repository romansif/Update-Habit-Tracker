import { readDB, writeDB } from './db.service.js';


export const habitsService = {
    getAllHabits (userId)  {
        const db = readDB();
        return db.habits.filter(h => h.userId === userId);
    },

    createHabit (userId, habitData) {
        const db = readDB();
        const newHabit = {
            id: Date.now().toString(),
            userId,
            title: habitData.title,
            description: habitData.description || '',
            frequency: habitData.frequency || 'daily',
            createdAt: new Date().toISOString()
        };
        db.habits.push(newHabit);
        writeDB(db);
        return newHabit;
    },

    deleteHabit (userId, habitId) {
        const db = readDB();
        const index = db.habits.findIndex(h => h.id === habitId && h.userId === userId);
        if (index === -1) return false;

        db.habits.splice(index, 1);
        db.records = db.records.filter(r => r.habitId !== habitId);
        writeDB(db);
        return true;
    },

}

import { readDB, writeDB } from './db.service.js';

export const recordsService = {
     getRecordsByHabit (userId, habitId) {
        const db = readDB();
        const habit = db.habits.find(h => h.id === habitId && h.userId === userId);
        if (!habit) return [];
        return db.records.filter(r => r.habitId === habitId);
     },

     addRecord (userId, habitId, status, note = '') {
        const db = readDB();
        const habit = db.habits.find(h => h.id === habitId && h.userId === userId);
        if (!habit) throw new Error('Привычка не найдена или доступ запрещен');

        const newRecord = {
            id: Date.now().toString(),
            habitId,
            date: new Date().toISOString().split('T')[0],
            status,
            note
        };
        db.records.push(newRecord);
        writeDB(db);
        return newRecord;
    },
}

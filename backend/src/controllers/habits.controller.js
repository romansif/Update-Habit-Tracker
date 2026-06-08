import { v4 as uuidv4 } from 'uuid';
import { dbService } from "../config/db.service.js";

export const habitsController = {
    getCount (req, res) {
        const db = dbService.readDB()
        const count = db["habits-count"].find(h => h.id === req.params.id);
        res.json(count || {});
    },
    createCount (req, res) {
        const db = dbService.readDB()
        const newCount = { id: uuidv4(), ...req.body };
        db["habits-count"].push(newCount);
        dbService.writeDB(db);
        res.status(201).json(newCount);
    },
    updateCount (req, res) {
        const db = dbService.readDB()
        const index = db["habits-count"].findIndex(h => h.id === req.params.id);
        if (index !== -1) db["habits-count"][index] = { ...db["habits-count"][index], ...req.body };
        dbService.writeDB(db);
        res.json(db["habits-count"][index] || {});
    },
    deleteCount (req, res) {
        const db = dbService.readDB();
        const index = db["habits-count"].findIndex(h => h.id === req.params.id);
        if (index === -1) return res.status(404).json({ message: "Счетчик не найден" });

        const [deletedCount] = db["habits-count"].splice(index, 1);
        dbService.writeDB(db);
        res.json(deletedCount);
    },

    getHabits (req, res) {
        const db = dbService.readDB()
        const userHabits = db.habits.filter(h => h.userId === req.user.userId);
        res.json(userHabits);
    },
    getHabitById (req, res) {
        const db = dbService.readDB()
        const habit = db.habits.find(h => h.id === req.params.id);
        res.json(habit || {});
    },
    createHabit (req, res) {
        const db = dbService.readDB()
        const newHabit = { id: uuidv4(), userId: req.user.userId, ...req.body };
        db.habits.push(newHabit);
        dbService.writeDB(db);
        res.status(201).json(newHabit);
    },
    updateHabit (req, res) {
        const db = dbService.readDB()
        const index = db.habits.findIndex(h => h.id === req.params.id);
        if (index !== -1) db.habits[index] = { ...db.habits[index], ...req.body };
        dbService.writeDB(db);
        res.json(db.habits[index] || {});
    },
    deleteHabit (req, res) {
        const db = dbService.readDB();
        const index = db.habits.findIndex(h => h.id === req.params.id);
        if (index === -1) return res.status(404).json({ message: "Привычка не найдена" });

        const [deletedHabit] = db.habits.splice(index, 1);
        dbService.writeDB(db);
        res.json(deletedHabit);
    }
}
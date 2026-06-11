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


    getFilteredHabits (req, res) {
        const db = dbService.readDB()
        const today = new Date();

        let userHabits = db.habits.filter(h => h.userId === req.user.userId);

        let habitsCount = db['habits-count'].find(c => c.userId === req.user.userId) || { allCompletedHabits: 0 }

        const formatDate = (dateSr) => dateSr ? new Date(dateSr.split('.').reverse().join('-')) : null;
        const isToday = (dateSr) => {
            const date = formatDate(dateSr);
            return date ? date.toDateString() === today.toDateString() : false
        }

        const rollBack = []
        let dbChanged = false;

        for( let habit of userHabits ) {
            const lastDate = formatDate(habit.lastDate);
            if(lastDate){
                const nextDate = new Date(lastDate);
                const frequency = {
                    'Ежедневно': 1,
                    '1 раз в неделю': 7,
                    '3 раза в неделю': 2
                }
                nextDate.setDate(nextDate.getDate() + (frequency[habit.frequency] || 1))

                if(today >= nextDate){
                    if(habit.status === 'Выполнено'){
                        habit.status = 'Не выполнено'
                        dbChanged = true;
                    }else if(habit.status === 'Не выполнено' && habit.currentSeries > 0){
                        habit.currentSeries = 0
                        rollBack.push(habit.currentSeries)
                        dbChanged = true;
                    }
                }
            }
            const endDate = formatDate(habit.endDateHabit);
            if(endDate && today >= endDate && habit.status !== 'Завершено'){
                habit.status = 'Завершено'
                habitsCount.allCompletedHabits = (habitsCount.allCompletedHabits || 0) + 1
                dbChanged = true;
            }
        }
        if(dbChanged){
            const index = db['habits-count'].findIndex(c => c.userId === req.user.userId);
            if (index !== -1) db['habits-count'][index] = habitsCount;
            dbService.writeDB(db)
        }

        const routeType = req.query.type
        if(routeType){
            switch(routeType){
                case 'all-habits':
                    break;
                case 'current-habits':
                    userHabits = userHabits.filter(h => h.status !== 'Выполнено' && h.status !== 'Завершено')
                    break
                case 'day-completed-habits':
                    userHabits = userHabits.filter(h => h.status === 'Выполнено' && isToday(h.lastDate))
                    break
                case 'all-completed-habits':
                    userHabits = userHabits.filter(h => h.status === 'Завершено')
                    break
                case 'in-progress-habits':
                    userHabits = userHabits.filter(h => h.status === 'В процессе')
                    break
                case 'incompleted-habits':
                    userHabits = userHabits.filter(h => h.status === 'Не выполнено')
                    break
            }
        }

        userHabits = userHabits.map(habit => {
            let isLocked = false
            if (habit.linkedHabit){
                const parent = userHabits.find(h => h.habit === habit?.linkedHabit)
                isLocked = parent ? parent?.status !== 'Выполнено' : false
            }

            return {
                ...habit,
                isLocked,
            }
        });

        const search = req.query.search?.toLowerCase();
        if(search) {
            userHabits = userHabits.filter(habit => {
                const inCategory = habit.category?.toLowerCase().includes(search) || false
                const inHabit = habit.habit?.toLowerCase().includes(search) || false
                const inDate = habit.dateCreatedHabit?.toLowerCase().includes(search) || false
                const inTime = habit.timeCreatedHabit?.toLowerCase().includes(search) || false
                return inCategory || inHabit || inDate || inTime
            });
        }

        const sortBy = req.query.sort;
        const order = req.query.order || 'asc';
        if (sortBy) {
            userHabits.sort((a, b) => {
                const valA = a[sortBy];
                const valB = b[sortBy];

                return order === 'asc'
                    ? valA > valB ? 1 : -1
                    : valA < valB ? 1 : -1;
            });
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedHabits = userHabits.slice(startIndex, endIndex);

        res.json({
            page,
            limit,
            total: userHabits.length,
            totalPages: Math.ceil(userHabits.length / limit),
            data: paginatedHabits
        });
    },

    getHabitById (req, res) {
        const db = dbService.readDB()
        const habit = db.habits.find(h => h.id === req.params.id);
        res.json(habit || {});
    },

    createHabit (req, res) {
        const db = dbService.readDB()
        console.log(req.body)
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
import { recordsService } from "../services/records.service.js";

export const recordsControllers = {
    async getRecords (req, res, next) {
        try {
            const records = recordsService.getRecordsByHabit(req.user.userId, req.params.habitId);
            res.json(records);
        } catch (error) {
            next(error);
        }
    },

    async addRecords (req, res, next)  {
        try {
            const { status, note } = req.body;
            if (!status) return res.status(400).json({ message: 'Статус обязателен' });
            const record = recordsService.addRecord(req.user.userId, req.params.habitId, status, note);
            res.status(201).json(record);
        } catch (error) {
            next(error);
        }
    },
}

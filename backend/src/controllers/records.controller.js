import { v4 as uuidv4 } from "uuid";
import { dbService } from "../config/db.service.js";

export const recordsController = {
    getRecords (req, res) {
        const db = dbService.readDB()
        let result = [...db.records];
        const { habitsCountId, monthCreatedRecord, dateCreatedRecord, recordId } = req.query;
        if (habitsCountId) result = result.filter(r => r.habitsCountId === habitsCountId);
        if (monthCreatedRecord) result = result.filter(r => String(r.monthCreatedRecord) === String(monthCreatedRecord));
        if (dateCreatedRecord) result = result.filter(r => r.dateCreatedRecord === dateCreatedRecord);
        if (recordId) result = result.filter(r => r.recordId === recordId);
        res.json(result);
    },

    getRecordsById (req, res) {
        const db = dbService.readDB()
        const records = db.records.find(h => h.id === req.params.id);
        res.json(records || {});
    },

    createRecord (req, res) {
        const db = dbService.readDB()
        const newRecord = { id: uuidv4(), ...req.body };
        db.records.push(newRecord);
        dbService.writeDB(db);
        res.status(201).json(newRecord);
    },

    updateRecord (req, res) {
        const db = dbService.readDB()
        const index = db.records.findIndex(h => h.id === req.params.id);
        if (index !== -1) db.records[index] = { ...db.records[index], ...req.body };
        dbService.writeDB(db);
        res.json(db.records[index] || {});
    },

    deleteRecord (req, res) {
        const db = dbService.readDB();
        const index = db.records.findIndex(r => r.id === req.params.id);
        if (index === -1) return res.status(404).json({ message: "Запись не найдена" });

        const [deletedRecord] = db.records.splice(index, 1);
        dbService.writeDB(db);
        res.json(deletedRecord);
    }
}
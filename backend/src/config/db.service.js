import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

export const dbService = {
    readDB () {
        try {
            if (!fs.existsSync(dbPath)) {
                const defaultDB = { users: [], habits: [], "habits-count": [], records: [] };
                fs.writeFileSync(dbPath, JSON.stringify(defaultDB, null, 2));
                return defaultDB;
            }
            const data = fs.readFileSync(dbPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Ошибка чтения db.json:", error);
            return { users: [], habits: [], "habits-count": [], records: [] };
        }
    },
    writeDB (data) {
        try {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error("Ошибка записи в db.json:", error);
        }
    }

}
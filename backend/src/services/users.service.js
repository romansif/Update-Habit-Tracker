import { readDB, writeDB } from "./db.service.js";

export const usersService = {
    async editUser (userId) {
        const db = await readDB();
        const user = db.users.find(user => user.id === userId);
        if (!user) return []

        return user;
    }
}
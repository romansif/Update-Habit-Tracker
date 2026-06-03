import { readDB, writeDB } from './db.service.js';
import bcrypt from 'bcryptjs';

export const authService = {
    findByEmail (email)  {
        const db = readDB();
        return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },

    findById (id) {
        const db = readDB();
        return db.users.find(u => u.id === id);
    },

    async createUser (email, password)  {
        const db = readDB();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: Date.now().toString(),
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        writeDB(db);
        return { id: newUser.id, email: newUser.email };
    }
}

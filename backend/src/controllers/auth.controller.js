import { authService } from '../services/auth.service.js';
import { readDB } from '../services/db.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_123';

export const authControllers = {
    async register (req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ message: 'Email и пароль обязательны' });

            const candidate = await authService.findByEmail(email);
            if (candidate) return res.status(400).json({ message: 'Такой充ользователь уже существует' });

            const newUser = await authService.createUser(email, password);
            res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUser });
        } catch (error) { next(error); }
    },

    async login (req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ message: 'Email и пароль обязательны' });

            const user = readDB().users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user) return res.status(400).json({ message: 'Неверный email или пароль' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Неверный email или пароль' });

            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, user: { id: user.id, email: user.email } });
        } catch (error) { next(error); }
    },

    async getProfile (req, res, next) {
        try {
            const user = authService.findById(req.user.userId);
            if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
            res.json({ id: user.id, email: user.email, createdAt: user.createdAt });
        } catch (error) { next(error); }
    },
}

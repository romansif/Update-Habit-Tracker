import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { dbService } from "../config/db.service.js";

const ACCESS_SECRET = 'your_access_secret_key_123'
const REFRESH_SECRET = 'your_refresh_secret_key_123'

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: '1m' });
}

const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
}

export const authController = {
    async register (req, res) {
        try {
            const db = dbService.readDB()
            const { name, email, password, dateCreatedAccount, habitsCountId } = req.body;

            const candidate = db.users.find(u => u.email === email);
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует',
                    errors: { email: 'Пользователь с таким email уже зарегистрирован' }
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: uuidv4(),
                name,
                email,
                password: hashedPassword,
                dateCreatedAccount,
                refreshTokens: [],
                habitsCountId
            };

            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);

            newUser.refreshTokens.push(refreshToken);

            db.users.push(newUser);
            dbService.writeDB(db);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 15 * 60 * 1000
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/api/refresh',
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const { password: _, refreshTokens: __, ...userWithoutPassword } = newUser;
            res.status(201).json({ ...userWithoutPassword, accessToken });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при регистрации' });
        }
    },

    async login (req, res) {
        const db = dbService.readDB();
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ message: 'Email и пароль обязательны' });
            }
            const user = db.users.find(u => u.email === email);
            if(!user){
                return res.status(400).json({
                    message: 'Неверный email или пароль',
                    errors: { email: 'Неверный email или пароль' }
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                return res.status(400).json({
                    message: 'Неверный email или пароль',
                    errors: { password: 'Неверный пароль' }
                });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            if (!user.refreshTokens) user.refreshTokens = [];
            user.refreshTokens.push(refreshToken);
            dbService.writeDB(db);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 15 * 60 * 1000
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/api/refresh',
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const { password: _, refreshTokens: __, ...userWithoutPassword } = user;

            return res.json({ ...userWithoutPassword, accessToken });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при авторизации' });
        }
    },

    async logout (req, res) {
        const refreshToken = req.cookies.accessToken;

        if(refreshToken){
            try{
                const db = dbService.readDB()

                const user = db.users.find(u => u.refreshTokens && u.refreshTokens.includes(refreshToken));
                if(user){
                    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
                    dbService.writeDB(db);
                }
            }catch(e){
                console.log(e);
            }
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken', { path: '/api/refresh' });

        return res.json({ success: true, message: 'Успешный выход из системы' });
    },

    async refresh (req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: 'Нет refresh токена' });

        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            const db = dbService.readDB();

            const user = db.users.find(u => u.id === decoded.userId);
            if (!user || !user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                return res.status(403).json({ message: 'Токен недействителен или отозван' });
            }

            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);

            user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
            user.refreshTokens.push(newRefreshToken);
            dbService.writeDB(db);

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 15 * 60 * 1000
            });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/api/refresh',
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({ success: true });
        } catch (e) {
            return res.status(403).json({ message: 'Refresh токен просрочен' });
        }
    },

    async getUsers (req, res) {
        const db = dbService.readDB()
        const cleanUsers = db.users.map(({ password, refreshTokens, ...u }) => u);
        res.json(cleanUsers);
    },

    async getUserById (req, res) {
        const db = dbService.readDB()
        const user = db.users.find(u => u.id === req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { password: _, refreshTokens: __, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    },

    async updateUser (req, res) {
        const db = dbService.readDB()
        const index = db.users.findIndex(h => h.id === req.params.id);
        if (index !== -1) db.users[index] = { ...db.users[index], ...req.body };
        dbService.writeDB(db);
        res.json(db.users[index] || {});
    },

    async deleteUser (req, res) {
        const db = dbService.readDB();
        const userId = req.params.id;

        if (req.user.userId !== userId) {
            return res.status(403).json({ message: "Нет прав на удаление чужого аккаунта" });
        }

        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return res.status(404).json({ message: "Пользователь не найден" });

        const [deletedUser] = db.users.splice(userIndex, 1);
        db.habits = db.habits.filter(h => h.userId !== userId);
        dbService.writeDB(db);


        res.clearCookie('accessToken');
        res.clearCookie('refreshToken', { path: '/api/refresh' });

        const { password: _, refreshTokens: __, ...userWithoutPassword } = deletedUser;
        res.json({ message: "Пользователь и его данные удалены", user: userWithoutPassword });
    }
}
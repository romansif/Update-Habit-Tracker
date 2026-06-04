import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express();
const PORT = 3000;

const ACCESS_SECRET = 'your_access_secret_key_123'
const REFRESH_SECRET = 'your_refresh_secret_key_123'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');


const generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: '1m' });
}

const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
}

const readDB = () => {
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
}

const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Ошибка записи в db.json:", error);
    }
}

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: 'Доступ запрещен. Войдите в аккаунт.' });
    }
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Сессия истекла, авторизуйтесь заново.' });
    }
};


app.post('/api/users', async (req, res) => {
    try {
        const db = readDB()
        const { name, email, password, dateCreatedAccount } = req.body;

        const candidate = db.users.find(u => u.email === email);
        if (candidate) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            dateCreatedAccount,
            refreshTokens: []
        };


        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        newUser.refreshTokens.push(refreshToken);

        db.users.push(newUser);
        writeDB(db);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/refresh',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: _, refreshTokens: __, ...userWithoutPassword } = newUser;
        res.status(201).json({ ...userWithoutPassword, accessToken });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Ошибка при регистрации' });
    }
});

app.get('/api/users', async (req, res) => {
    const db = readDB()
    const { email } = req.query;
    if (email) {
        const user = db.users.find(u => u.email === email);
        if (!user) return res.json([]);

        const accessToken = generateAccessToken(user);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 15 * 60 * 1000
        });

        return res.json([{ ...user, accessToken }]);
    }
    res.json(db.users);
});

app.get('/api/users/:id', authMiddleware, (req, res) => {
    const db = readDB()
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password: _, refreshTokens: __, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

app.delete('/api/users/:id', authMiddleware, (req, res) => {
    const db = readDB();
    const userId = req.params.id;

    if (req.user.userId !== userId) {
        return res.status(403).json({ message: "Нет прав на удаление чужого аккаунта" });
    }

    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ message: "Пользователь не найден" });

    const [deletedUser] = db.users.splice(userIndex, 1);
    db.habits = db.habits.filter(h => h.userId !== userId);
    writeDB(db);


    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/refresh' });

    const { password: _, refreshTokens: __, ...userWithoutPassword } = deletedUser;
    res.json({ message: "Пользователь и его данные удалены", user: userWithoutPassword });
});

app.post('/api/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Нет refresh токена' });

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const db = readDB();

        const user = db.users.find(u => u.id === decoded.userId);
        if (!user || !user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ message: 'Токен недействителен или отозван' });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        writeDB(db);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/refresh',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true });
    } catch (e) {
        return res.status(403).json({ message: 'Refresh токен просрочен' });
    }
});



app.get('/api/habits-count/:id', authMiddleware, (req, res) => {
    const db = readDB()
    const count = db["habits-count"].find(h => h.id === req.params.id);
    res.json(count || {});
});

app.post('/api/habits-count', authMiddleware, (req, res) => {
    const db = readDB()
    const newCount = { id: uuidv4(), ...req.body };
    db["habits-count"].push(newCount);
    writeDB(db);
    res.status(201).json(newCount);
});

app.patch('/api/habits-count/:id', authMiddleware, (req, res) => {
    const db = readDB()
    const index = db["habits-count"].findIndex(h => h.id === req.params.id);
    if (index !== -1) db["habits-count"][index] = { ...db["habits-count"][index], ...req.body };
    writeDB(db);
    res.json(db["habits-count"][index] || {});
});

app.delete('/api/habits-count/:id', authMiddleware, (req, res) => {
    const db = readDB();
    const index = db["habits-count"].findIndex(h => h.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Счетчик не найден" });

    const [deletedCount] = db["habits-count"].splice(index, 1);
    writeDB(db);
    res.json(deletedCount);
});

app.get('/api/habits', authMiddleware, (req, res) => {
    const db = readDB()
    const userHabits = db.habits.filter(h => h.userId === req.user.userId);
    res.json(userHabits);
});

app.get('/api/habits/:id', authMiddleware, (req, res) => {
    const db = readDB()
    const habit = db.habits.find(h => h.id === req.params.id);
    res.json(habit || {});
})

app.post('/api/habits', authMiddleware, (req, res) => {
    const db = readDB()
    const newHabit = { id: uuidv4(), userId: req.user.userId, ...req.body };
    db.habits.push(newHabit);
    writeDB(db);
    res.status(201).json(newHabit);
});

app.patch('/api/habits/:id', authMiddleware, (req, res) => {
    const db = readDB()
    const index = db.habits.findIndex(h => h.id === req.params.id);
    if (index !== -1) db.habits[index] = { ...db.habits[index], ...req.body };
    writeDB(db);
    res.json(db.habits[index] || {});
})

app.delete('/api/habits/:id', authMiddleware, (req, res) => {
    const db = readDB();
    const index = db.habits.findIndex(h => h.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Привычка не найдена" });

    const [deletedHabit] = db.habits.splice(index, 1);
    writeDB(db);
    res.json(deletedHabit);
});

app.get('/api/records', authMiddleware, (req, res) => {
    const db = readDB()
    let result = [...db.records];
    const { habitsCountId, monthCreatedRecord, dateCreatedRecord, recordId } = req.query;
    if (habitsCountId) result = result.filter(r => r.habitsCountId === habitsCountId);
    if (monthCreatedRecord) result = result.filter(r => String(r.monthCreatedRecord) === String(monthCreatedRecord));
    if (dateCreatedRecord) result = result.filter(r => r.dateCreatedRecord === dateCreatedRecord);
    if (recordId) result = result.filter(r => r.recordId === recordId);
    res.json(result);
});

app.get('/api/records/:id', authMiddleware, (req, res) => {
    const db = readDB()
    const records = db.records.find(h => h.id === req.params.id);
    res.json(records || {});
})

app.post('/api/records', authMiddleware, (req, res) => {
    const db = readDB()
    const newRecord = { id: uuidv4(), ...req.body };
    db.records.push(newRecord);
    writeDB(db);
    res.status(201).json(newRecord);
});

app.patch('/api/records/:id', authMiddleware, (req, res) => {
    const db = readDB()
    const index = db.records.findIndex(h => h.id === req.params.id);
    if (index !== -1) db.records[index] = { ...db.records[index], ...req.body };
    writeDB(db);
    res.json(db.records[index] || {});
})

app.delete('/api/records/:id', authMiddleware, (req, res) => {
    const db = readDB();
    const index = db.records.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Запись не найдена" });

    const [deletedRecord] = db.records.splice(index, 1);
    writeDB(db);
    res.json(deletedRecord);
});

app.listen(PORT, () => {
    console.log(`✓ Сервер запущен на http://localhost:${PORT}`);
    console.log(`  API: http://localhost:${PORT}/api`);
});
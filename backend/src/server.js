import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import habitsRoutes from './routes/habits.routes.js'
import recordsRoutes from './routes/records.routes.js'

const app = express();
const PORT = 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api/', habitsRoutes);
app.use('/api/', recordsRoutes);

app.listen(PORT, () => {
    console.log(`✓ Сервер запущен на http://localhost:${PORT}`);
    console.log(`  API: http://localhost:${PORT}/api`);
});
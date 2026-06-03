import express from 'express';
import { authControllers } from '../controllers/auth.controller.js';
import { readDB } from '../services/db.service.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/users', (req, res, next) => {
    try {
        const db = readDB();
        const safeUsers = db.users.map(u => ({ id: u.id, email: u.email }));
        res.json(safeUsers);
    } catch (error) { next(error); }
});
router.post('/users', authControllers.register);

router.post('/auth/register', authControllers.register);
router.post('/auth/login', authControllers.login);
router.get('/user/profile', authMiddleware, authControllers.getProfile);

export default router;

import express from 'express';
import authRoutes from './auth.routes.js';
import habitRoutes from './habits.routes.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/', habitRoutes);
router.use('/', );

export default router;
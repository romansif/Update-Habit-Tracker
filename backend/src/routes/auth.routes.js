import express from "express";
import { authController } from '../controllers/auth.controller.js'
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validation } from "../middleware/validation.js";

const router = express.Router();

router.post('/users/register', validation.registerValidation, validation.handleValidationErrors, authController.register);
router.post('/users/login', validation.loginValidation, validation.handleValidationErrors, authController.login);
router.post('/users/logout', authController.logout);
router.post('/refresh', authController.refresh);

router.get('/users', authMiddleware, authController.getUsers);
router.get('/users/:id', authMiddleware, authController.getUserById);
router.delete('/users/:id', authMiddleware, authController.deleteUser);

export default router;
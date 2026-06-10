import { body, validationResult } from 'express-validator';

export const validation = {
    registerValidation: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Имя обязательно для регистрации')
            .isLength({ min: 3, max: 30 })
            .withMessage('Имя должно состоять от 3 до 30 символов'),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email обязателен для регистрации')
            .isEmail()
            .withMessage('Введен некорректный формат email')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Пароль обязателен для регистрации')
            .isLength({ min: 6 })
            .withMessage('Пароль должен быть не менее 6 символов')
    ],

    loginValidation: [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email обязателен для входа')
            .isEmail()
            .withMessage('Введен некорректный формат email')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Пароль обязателен для входа')
    ],

    updateValidation: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Новое имя обязательно для его обновления')
            .isLength({ min: 3, max: 30 })
            .withMessage('Имя должно состоять от 3 до 30 символов'),
    ],

    habitValidation: [
        body('category')
            .trim()
            .notEmpty()
            .withMessage('Категория привычки обязательна для создания'),

        body('time')
            .trim()
            .notEmpty()
            .withMessage('Время на выполнение обязательно для создания')
            .not()
            .equals('мин в день')
            .withMessage('Выберите время выполнения'),

        body('habit')
            .trim()
            .notEmpty()
            .withMessage('Назввание привычки обязательно для создания')
            .isLength({ min: 3, max: 20 })
            .withMessage('Название привычки должно состоять от 3 до 20 символов'),

        body('frequency')
            .trim()
            .notEmpty()
            .withMessage('Частота выполнения обязательна для создания'),

        body('term')
            .trim()
            .notEmpty()
            .withMessage('Срок выполнения обязателен для создания')
    ],


    handleValidationErrors (req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(err => {
                formattedErrors[err.path] = err.msg;
            });

            return res.status(400).json({
                message: 'Ошибка валидации данных',
                errors: formattedErrors
            });
        }
        next();
    }
};
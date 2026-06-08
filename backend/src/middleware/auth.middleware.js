import jwt from "jsonwebtoken";

const ACCESS_SECRET = 'your_access_secret_key_123'

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Доступ запрещен. Токен не передан.' });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Сессия истекла, авторизуйтесь заново.' });
    }
};

// server/middleware/adminAuth.js

export function requireAdmin(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || !token.startsWith('simple-')) {
        return res.status(401).json({ message: "Требуется авторизация" });
    }

    // Простая проверка токена (в реальном приложении нужно проверять JWT)
    next();
}

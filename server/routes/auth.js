// server/routes/auth.js
import express from "express";

const router = express.Router();

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// POST /api/auth/login { login, password }
router.post("/login", (req, res) => {
    const { login, password } = req.body || {};

    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
        // без JWT, просто флажок
        return res.json({
            success: true,
            token: "simple-admin-token"
        });
    }

    return res.status(401).json({ message: "Неверный логин или пароль" });
});

export default router;

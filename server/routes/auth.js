// server/routes/auth.js
import express from "express";
import { AdminUser } from "../models/AdminUser.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res
                .status(400)
                .json({ message: "Укажите логин и пароль" });
        }

        const user = await AdminUser.findOne({ login });
        if (!user || user.password !== password) {
            return res
                .status(401)
                .json({ message: "Неверный логин или пароль" });
        }

        // простой токен, без JWT
        const token = `simple-${user._id}`;
        res.json({ token });
    } catch (err) {
        console.error("POST /api/auth/login error", err);
        res.status(500).json({ message: "Ошибка авторизации" });
    }
});

export default router;

// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import programsRouter from "./routes/programs.js";
import requestsRouter from "./routes/requests.js";
import authRouter from "./routes/auth.js";
import publicRouter from "./routes/public.js";
import adminRouter from "./routes/admin.js";
import { Program } from "./models/Program.js";
import { AdminUser } from "./models/AdminUser.js";
import { Category } from "./models/Category.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.json({ message: "Teambuilding API is running" });
});

// API
app.use("/api/public", publicRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

// Старые роуты для обратной совместимости
app.use("/api/programs", programsRouter);
app.use("/api/requests", requestsRouter);

// сиды: админ + дефолтная программа
async function seedInitialData() {
    // сидим только если включено SEED=true
    if (process.env.SEED !== "true") return;

    // 1) Программы
    const programsCount = await Program.countDocuments();
    if (programsCount === 0) {
        await Program.create({
            slug: "hungry-games",
            title: "Голодные игры",
            shortDescription:
                "Выездной квест для команд по мотивам антиутопии: серия испытаний, где важен вклад каждого.",
            duration: "2–4 часа",
            peopleFrom: 20,
            priceFrom: "от 8000 руб./чел",
            format: "Выездной офлайн-квест",
            goals: [
                "сплотить коллектив через общий вызов и эмоции;",
                "отработать взаимодействие и доверие в команде;",
                "увидеть естественные роли и лидерство в действии."
            ],
            structure: [
                "Вводная часть: легенда, цель, правила, формирование команд.",
                "Основной блок: серия тематических испытаний с ограниченным временем.",
                "Финальное командное испытание с максимальной вовлечённостью всех участников.",
                "Разбор: обратная связь, фиксация инсайтов и идей для работы."
            ]
        });
        console.log("Seed: добавлена программа «Голодные игры»");
    }

    // 2) Админ
    const adminLogin = process.env.ADMIN_LOGIN || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const adminExists = await AdminUser.findOne({ login: adminLogin });
    if (!adminExists) {
        await AdminUser.create({
            login: adminLogin,
            password: adminPassword
        });
        console.log(
            `Seed: создан админ login=${adminLogin}, password=${adminPassword}`
        );
    }
}

async function start() {
    try {
        await connectDB();
        await seedInitialData();

        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Server start error:", err);
        process.exit(1);
    }
}

start();

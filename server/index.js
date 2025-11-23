// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import programsRouter from "./routes/programs.js";
import requestsRouter from "./routes/requests.js";
import authRouter from "./routes/auth.js";
import { Program } from "./models/Program.js";
import { Request } from "./models/Request.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(cors());
app.use(express.json());

// тестовый маршрут
app.get("/", (req, res) => {
    res.json({ message: "Teambuilding API is running" });
});

// API
app.use("/api/programs", programsRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/auth", authRouter);

// простой сидер
async function seedInitialData() {
    // программы
    const programsCount = await Program.countDocuments();
    if (programsCount === 0) {
        console.log("Seeding programs...");

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

        console.log("Programs seeded");
    }

    // заявки
    const requestsCount = await Request.countDocuments();
    if (requestsCount === 0) {
        console.log("Seeding requests...");

        await Request.create([
            {
                org: "Орифлейм",
                people: 25,
                email: "orifley@mail.ru",
                phone: "79990000000",
                wish: "07.12.2025",
                programId: "hungry-games",
                comment: "Хочется активный выездной формат",
                status: "new"
            },
            {
                org: "Мост",
                people: 25,
                email: "most@mail.ru",
                phone: "79858955889",
                wish: "07.11.2025",
                programId: "hungry-games",
                comment: "Дата уже согласована, нужна смета",
                status: "confirmed"
            }
        ]);

        console.log("Requests seeded");
    }
}

// подключение к БД и старт сервера
async function start() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not set in .env");
        }

        await mongoose.connect(uri);
        console.log("MongoDB connected");

        await seedInitialData();

        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection / start error:", err);
        process.exit(1);
    }
}

start();

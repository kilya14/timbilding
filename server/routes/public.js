// server/routes/public.js
import express from "express";
import { Category } from "../models/Category.js";
import { Program } from "../models/Program.js";
import { Request } from "../models/Request.js";

const router = express.Router();

// GET /api/public/categories — список активных категорий
router.get("/categories", async (req, res) => {
    try {
        const items = await Category.find({ active: true }).sort({ position: 1, title: 1 });
        res.json(items);
    } catch (err) {
        console.error("GET /api/public/categories error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/public/programs — список программ (только active=true)
router.get("/programs", async (req, res) => {
    try {
        const { categoryId } = req.query;
        const filter = { active: true };

        if (categoryId) {
            filter.categoryId = categoryId;
        }

        const items = await Program.find(filter)
            .sort({ position: 1, title: 1 })
            .populate('categoryId', 'title');

        res.json(items);
    } catch (err) {
        console.error("GET /api/public/programs error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/public/programs/:slug — одна программа по slug
router.get("/programs/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const program = await Program.findOne({ slug, active: true })
            .populate('categoryId', 'title');

        if (!program) {
            return res.status(404).json({ message: "Программа не найдена" });
        }

        res.json(program);
    } catch (err) {
        console.error("GET /api/public/programs/:slug error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/public/requests — создание новой заявки
router.post("/requests", async (req, res) => {
    try {
        const {
            companyName,
            email,
            phone,
            programId,
            eventDate,
            participantsCount,
            comment
        } = req.body;

        if (!companyName || !email || !phone) {
            return res.status(400).json({
                message: "Заполните обязательные поля: companyName, email, phone"
            });
        }

        const request = await Request.create({
            companyName,
            email,
            phone,
            programId,
            eventDate,
            participantsCount: participantsCount || 0,
            comment
        });

        res.status(201).json(request);
    } catch (err) {
        console.error("POST /api/public/requests error", err);
        res.status(500).json({ message: "Ошибка создания заявки" });
    }
});

export default router;

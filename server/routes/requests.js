// server/routes/requests.js
import express from "express";
import { Request } from "../models/Request.js";

const router = express.Router();

// GET /api/requests — список всех заявок
router.get("/", async (req, res) => {
    try {
        const items = await Request.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error("GET /api/requests error", err);
        res.status(500).json({ message: "Ошибка загрузки заявок" });
    }
});

// GET /api/requests/:id — одна заявка
router.get("/:id", async (req, res) => {
    try {
        const item = await Request.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }
        res.json(item);
    } catch (err) {
        console.error("GET /api/requests/:id error", err);
        res.status(500).json({ message: "Ошибка загрузки заявки" });
    }
});

// POST /api/requests — создание новой заявки с сайта
router.post("/", async (req, res) => {
    try {
        const {
            org,
            people,
            wish,
            email,
            phone,
            comment,
            programId
        } = req.body;

        if (!org || !email || !phone) {
            return res
                .status(400)
                .json({ message: "Заполните организацию, email и телефон" });
        }

        const request = await Request.create({
            org,
            people: people || 0,
            wish,
            email,
            phone,
            comment,
            programId
        });

        res.status(201).json(request);
    } catch (err) {
        console.error("POST /api/requests error", err);
        res.status(500).json({ message: "Ошибка создания заявки" });
    }
});

// PATCH /api/requests/:id — обновление заявки (статус, поля, комментарий менеджера)
router.patch("/:id", async (req, res) => {
    try {
        const data = req.body;

        const item = await Request.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }

        res.json(item);
    } catch (err) {
        console.error("PATCH /api/requests/:id error", err);
        res.status(500).json({ message: "Ошибка обновления заявки" });
    }
});

// DELETE /api/requests/:id — удалить заявку
router.delete("/:id", async (req, res) => {
    try {
        const item = await Request.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/requests/:id error", err);
        res.status(500).json({ message: "Ошибка удаления заявки" });
    }
});

export default router;

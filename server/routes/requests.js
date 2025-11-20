// server/routes/requests.js
import express from "express";
import { Request } from "../models/Request.js";

const router = express.Router();

// POST /api/requests — создать заявку
router.post("/", async (req, res) => {
    try {
        const { org, people, email, phone, wish, comment, programId } = req.body;

        if (!org || !email || !phone) {
            return res.status(400).json({ message: "org, email, phone обязательны" });
        }

        const request = await Request.create({
            org,
            people: people || 0,
            email,
            phone,
            wish,
            comment,
            programId
        });

        res.status(201).json(request);
    } catch (err) {
        console.error("POST /api/requests error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/requests — получить все заявки
router.get("/", async (req, res) => {
    try {
        const items = await Request.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error("GET /api/requests error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/requests/:id — обновить статус заявки
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["new", "in_progress", "done"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Некорректный статус" });
        }

        const request = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }

        res.json(request);
    } catch (err) {
        console.error("PATCH /api/requests/:id error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

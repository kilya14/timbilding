// server/routes/programs.js
import express from "express";
import {Program} from "../models/Program.js";

const router = express.Router();

// GET /api/programs — список всех программ
router.get("/", async (req, res) => {
    try {
        const items = await Program.find().sort({ title: 1 });
        res.json(items);
    } catch (err) {
        console.error("GET /api/programs error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/programs/:slug — одна программа по slug
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const program = await Program.findOne({ slug });

        if (!program) {
            return res.status(404).json({ message: "Программа не найдена" });
        }

        res.json(program);
    } catch (err) {
        console.error("GET /api/programs/:slug error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/programs — создать программу
router.post("/", async (req, res) => {
    try {
        const {
            slug,
            title,
            shortDescription,
            duration,
            peopleFrom,
            priceFrom,
            format,
            goals,
            structure
        } = req.body;

        if (!slug || !title) {
            return res.status(400).json({ message: "slug и title обязательны" });
        }

        const exists = await Program.findOne({ slug });
        if (exists) {
            return res.status(400).json({ message: "Программа с таким slug уже есть" });
        }

        const program = await Program.create({
            slug,
            title,
            shortDescription,
            duration,
            peopleFrom,
            priceFrom,
            format,
            goals,
            structure
        });

        res.status(201).json(program);
    } catch (err) {
        console.error("POST /api/programs error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/programs/:id — обновить программу
router.patch("/:id", async (req, res) => {
    try {
        const allowed = [
            "slug",
            "title",
            "shortDescription",
            "duration",
            "peopleFrom",
            "priceFrom",
            "format",
            "goals",
            "structure"
        ];

        const data = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) data[key] = req.body[key];
        }

        const updated = await Program.findByIdAndUpdate(req.params.id, data, {
            new: true
        });
        if (!updated) {
            return res.status(404).json({ message: "Программа не найдена" });
        }

        res.json(updated);
    } catch (err) {
        console.error("PATCH /api/programs/:id error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/programs/:id — удалить программу
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Program.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Программа не найдена" });
        }
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/programs/:id error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

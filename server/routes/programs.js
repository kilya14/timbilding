// server/routes/programs.js
import express from "express";
import { Program } from "../models/Program.js";

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

// PATCH /api/programs/:id — обновление программы
router.patch("/:id", async (req, res) => {
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

        const data = {};

        if (slug !== undefined) data.slug = slug;
        if (title !== undefined) data.title = title;
        if (shortDescription !== undefined) data.shortDescription = shortDescription;
        if (duration !== undefined) data.duration = duration;
        if (peopleFrom !== undefined) data.peopleFrom = peopleFrom;
        if (priceFrom !== undefined) data.priceFrom = priceFrom;
        if (format !== undefined) data.format = format;
        if (goals !== undefined) data.goals = goals;
        if (structure !== undefined) data.structure = structure;

        const program = await Program.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        );

        if (!program) {
            return res.status(404).json({ message: "Программа не найдена" });
        }

        res.json(program);
    } catch (err) {
        console.error("PATCH /api/programs/:id error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/programs/:id — удаление программы
router.delete("/:id", async (req, res) => {
    try {
        const program = await Program.findByIdAndDelete(req.params.id);
        if (!program) {
            return res.status(404).json({ message: "Программа не найдена" });
        }
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/programs/:id error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

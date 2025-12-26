// server/routes/admin.js
import express from "express";
import { Category } from "../models/Category.js";
import { Program } from "../models/Program.js";
import { Request } from "../models/Request.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Применяем защиту ко всем роутам
router.use(requireAdmin);

// =====================
// CATEGORIES CRUD
// =====================

// GET /api/admin/categories
router.get("/categories", async (req, res) => {
    try {
        const items = await Category.find().sort({ position: 1, title: 1 });
        res.json(items);
    } catch (err) {
        console.error("GET /api/admin/categories error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/admin/categories
router.post("/categories", async (req, res) => {
    try {
        const { slug, title, description, icon, coverImage, position, active } = req.body;

        if (!slug || !title) {
            return res.status(400).json({ message: "slug и title обязательны" });
        }

        const category = await Category.create({
            slug,
            title,
            description,
            icon,
            coverImage,
            position,
            active
        });
        res.status(201).json(category);
    } catch (err) {
        console.error("POST /api/admin/categories error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/admin/categories/:id
router.patch("/categories/:id", async (req, res) => {
    try {
        const data = {};
        const fields = ['slug', 'title', 'description', 'icon', 'coverImage', 'position', 'active'];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                data[field] = req.body[field];
            }
        });

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" });
        }

        res.json(category);
    } catch (err) {
        console.error("PATCH /api/admin/categories/:id error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/admin/categories/:id
router.delete("/categories/:id", async (req, res) => {
    try {
        // Проверяем, есть ли программы в этой категории
        const programsCount = await Program.countDocuments({ categoryId: req.params.id });

        if (programsCount > 0) {
            return res.status(400).json({
                message: `Нельзя удалить категорию: есть ${programsCount} программ в этой категории`
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/admin/categories/:id error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// =====================
// PROGRAMS CRUD
// =====================

// GET /api/admin/programs
router.get("/programs", async (req, res) => {
    try {
        const items = await Program.find()
            .sort({ position: 1, title: 1 })
            .populate('categoryId', 'title');
        res.json(items);
    } catch (err) {
        console.error("GET /api/admin/programs error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/admin/programs
router.post("/programs", async (req, res) => {
    try {
        const program = await Program.create(req.body);
        res.status(201).json(program);
    } catch (err) {
        console.error("POST /api/admin/programs error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
});

// PATCH /api/admin/programs/:id
router.patch("/programs/:id", async (req, res) => {
    try {
        const program = await Program.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!program) {
            return res.status(404).json({ message: "Программа не найдена" });
        }

        res.json(program);
    } catch (err) {
        console.error("PATCH /api/admin/programs/:id error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
});

// DELETE /api/admin/programs/:id
router.delete("/programs/:id", async (req, res) => {
    try {
        const program = await Program.findByIdAndDelete(req.params.id);

        if (!program) {
            return res.status(404).json({ message: "Программа не найдена" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/admin/programs/:id error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// =====================
// REQUESTS CRUD
// =====================

// GET /api/admin/requests
router.get("/requests", async (req, res) => {
    try {
        const items = await Request.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error("GET /api/admin/requests error", err);
        res.status(500).json({ message: "Ошибка загрузки заявок" });
    }
});

// GET /api/admin/requests/:id
router.get("/requests/:id", async (req, res) => {
    try {
        const item = await Request.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }

        res.json(item);
    } catch (err) {
        console.error("GET /api/admin/requests/:id error", err);
        res.status(500).json({ message: "Ошибка загрузки заявки" });
    }
});

// PATCH /api/admin/requests/:id
router.patch("/requests/:id", async (req, res) => {
    try {
        const { status } = req.body;

        // Валидация статуса
        const validStatuses = ["new", "in_progress", "waiting", "confirmed", "cancelled", "finished"];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Неверный статус. Допустимые значения: ${validStatuses.join(", ")}`
            });
        }

        const data = req.body;
        const item = await Request.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }

        res.json(item);
    } catch (err) {
        console.error("PATCH /api/admin/requests/:id error", err);
        res.status(500).json({ message: "Ошибка обновления заявки" });
    }
});

// DELETE /api/admin/requests/:id
router.delete("/requests/:id", async (req, res) => {
    try {
        const item = await Request.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/admin/requests/:id error", err);
        res.status(500).json({ message: "Ошибка удаления заявки" });
    }
});

export default router;

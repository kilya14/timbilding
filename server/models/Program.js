// server/models/Program.js
import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true }, // "hungry-games"
        title: { type: String, required: true },              // "Голодные игры"
        shortDescription: String,
        duration: String,                                     // "2–4 часа"
        peopleFrom: Number,                                   // 20
        priceFrom: String,                                    // "от 8000 руб./чел"
        format: String,                                       // "Выездной офлайн-квест"
        goals: [String],                                      // массив строк
        structure: [String]                                   // массив шагов
    },
    {
        timestamps: true
    }
);

export const Program = mongoose.model("Program", programSchema);

// server/models/Request.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
    {
        org: { type: String, required: true },   // Наименование организации
        people: { type: Number, default: 0 },    // Количество участников
        email: { type: String, required: true },
        phone: { type: String, required: true },
        wish: String,                            // Желаемая дата
        comment: String,
        programId: String,                       // ID или slug программы
        status: {
            type: String,
            enum: ["new", "in_progress", "done"],
            default: "new"
        }
    },
    { timestamps: true }
);

export const Request = mongoose.model("Request", requestSchema);

// server/models/Request.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
    {
        org: { type: String, required: true },              // Наименование организации
        people: { type: Number, default: 0 },               // Количество участников
        wish: { type: String },                             // Желаемая дата (строка)
        email: { type: String, required: true },
        phone: { type: String, required: true },
        comment: { type: String },                          // Комментарий клиента
        programId: { type: String },                        // id/slug программы

        status: {
            type: String,
            enum: [
                "new",              // Новая
                "in_progress",      // В обработке
                "waiting",          // Ждём подтверждения
                "confirmed",        // Подтверждена
                "cancelled",        // Отменена
                "finished"          // Завершена
            ],
            default: "new"
        },

        managerNote: { type: String }                       // внутренний комментарий менеджера
    },
    {
        timestamps: true // createdAt, updatedAt
    }
);

export const Request = mongoose.model("Request", requestSchema);

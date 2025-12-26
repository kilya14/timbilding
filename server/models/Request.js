// server/models/Request.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
    {
        // Основная информация
        companyName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },

        // Связь с программой
        programId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program',
            required: true
        },

        // Детали мероприятия
        preferredDate: { type: Date },
        alternativeDate: { type: Date },  // альтернативная дата
        participantsCount: { type: Number, required: true },

        // Пожелания клиента
        budget: { type: String },  // "до 100000 руб"
        goals: [String],  // ["Сплочение команды", "Развитие коммуникации"]
        comment: { type: String },

        // Источник
        source: {
            type: String,
            enum: ['website', 'social', 'referral', 'repeat', 'other'],
            default: 'website'
        },

        // Статус и работа менеджера
        status: {
            type: String,
            enum: [
                "new",          // Новая
                "in_progress",  // В обработке
                "waiting",      // Ждём подтверждения
                "confirmed",    // Подтверждена
                "cancelled",    // Отменена
                "finished"      // Завершена
            ],
            default: "new"
        },
        managerComment: { type: String },
        assignedTo: { type: String },  // email менеджера

        // Финансы
        finalPrice: { type: Number },  // итоговая согласованная цена
        paid: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

export const Request = mongoose.model("Request", requestSchema);

// server/models/Program.js
import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
    {
        // Основная информация
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

        // Описания
        shortDescription: String,
        fullDescription: String,

        // Участники
        minParticipants: { type: Number, default: 10 },
        maxParticipants: { type: Number, default: 100 },
        recommendedParticipants: { type: Number, default: 20 },

        // Время и место
        durationMinutes: { type: Number },  // 120-240 минут
        location: {
            type: String,
            enum: ['indoor', 'outdoor', 'online', 'hybrid'],
            default: 'outdoor'
        },

        // Сложность и характеристики
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        physicalActivity: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },

        // Медиа
        coverImage: String,
        gallery: [String],  // массив URL изображений

        // Цены
        basePrice: { type: Number },  // базовая цена в рублях
        pricePerPerson: { type: Number },  // цена за человека

        // Контент
        goals: [String],  // цели программы
        structure: [String],  // структура мероприятия
        included: [String],  // что включено
        tags: [String],  // теги для поиска

        // Дополнительно для тимбилдинга
        seasons: [{
            type: String,
            enum: ['spring', 'summer', 'autumn', 'winter', 'all-year']
        }],
        suitableFor: [String],  // для кого подходит
        outcomes: [String],  // ожидаемые результаты

        // Админ
        position: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
        featured: { type: Boolean, default: false }  // избранная программа
    },
    {
        timestamps: true
    }
);

// Виртуальное поле для обратной совместимости
programSchema.virtual('duration').get(function() {
    if (!this.durationMinutes) return null;
    const hours = Math.floor(this.durationMinutes / 60);
    const mins = this.durationMinutes % 60;
    if (mins === 0) return `${hours} ч`;
    return `${hours} ч ${mins} мин`;
});

programSchema.virtual('priceFrom').get(function() {
    if (this.pricePerPerson) return `от ${this.pricePerPerson} руб./чел`;
    if (this.basePrice) return `от ${this.basePrice} руб.`;
    return null;
});

// Включить виртуальные поля в JSON
programSchema.set('toJSON', { virtuals: true });
programSchema.set('toObject', { virtuals: true });

export const Program = mongoose.model("Program", programSchema);

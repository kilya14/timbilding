// src/features/programs/programsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [
        {
            id: "hungry-games",
            slug: "hungry-games",
            title: "Голодные игры",
            shortDescription: "Выездной квест для команд по мотивам антиутопии: серия испытаний, где важен вклад каждого.",
            duration: "2–4 часа",
            peopleFrom: 20,
            priceFrom: "от 8000 руб./чел",
            format: "Выездной офлайн-квест",
            goals: [
                "сплотить коллектив через общий вызов и эмоции;",
                "отработать взаимодействие и доверие в команде;",
                "увидеть естественные роли и лидерство в действии."
            ],
            structure: [
                "Вводная часть: легенда, цель, правила, формирование команд.",
                "Основной блок: серия тематических испытаний с ограниченным временем.",
                "Финальное командное испытание с максимальной вовлечённостью всех участников.",
                "Разбор: обратная связь, фиксация инсайтов и идей для работы."
            ]
        }
    ]
};

const programsSlice = createSlice({
    name: "programs",
    initialState,
    reducers: {}
});

export default programsSlice.reducer;

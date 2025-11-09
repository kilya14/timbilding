import { createSlice, nanoid } from "@reduxjs/toolkit";


const initialState = {
    items: [
        { id: nanoid(), slug: "hungry-games", title: "Квест «Голодные игры»", price: 8000, group: "20–40 чел", duration: "2–4 часа", image: "/assets/card-quest.jpg", desc: "Тактический квест с динамикой и командными ролями." },
        { id: nanoid(), slug: "chain-reaction", title: "Цепная реакция", price: 6500, group: "15–30 чел", duration: "2 часа", image: "/assets/card-2.jpg", desc: "Инженерный тимбилдинг: собираем общий механизм." },
    ],
};


const programsSlice = createSlice({
    name: "programs",
    initialState,
    reducers: {
        addProgram: {
            reducer(state, { payload }) { state.items.unshift(payload); },
            prepare(data) { return { payload: { id: nanoid(), ...data } }; },
        },
        updateProgram(state, { payload }) {
            const i = state.items.findIndex((x) => x.id === payload.id);
            if (i >= 0) state.items[i] = { ...state.items[i], ...payload };
        },
        removeProgram(state, { payload }) {
            state.items = state.items.filter((x) => x.id !== payload);
        },
    },
});


export const { addProgram, updateProgram, removeProgram } = programsSlice.actions;
export default programsSlice.reducer;
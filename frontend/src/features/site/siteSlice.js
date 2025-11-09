import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    colors: {
        orange: "#FF8F2A",
        orange2: "#FFB56B",
        text: "#1C1C1C",
        muted: "#6B7280",
        grayCard: "#ECEDEF",
    },
    contacts: {
        phoneMsk: "+7 (495) 123‑45‑67",
        phone8800: "8 (800) 505‑00‑00",
        email1: "hello@team.ru",
        email2: "advent@team.ru",
        address: "Москва, Переулок Комедийца д.12, стр.3, БЦ «Атмосфера», 4 этаж",
        metro: "Метро «Достоевская», 5 минут пешком",
        hours: "Пн–Пт 9:00–19:00",
    },
};


const siteSlice = createSlice({
    name: "site",
    initialState,
    reducers: {
        setContacts(state, { payload }) { state.contacts = payload; },
        setColors(state, { payload }) { state.colors = { ...state.colors, ...payload }; },
    },
});


export const { setContacts, setColors } = siteSlice.actions;
export default siteSlice.reducer;
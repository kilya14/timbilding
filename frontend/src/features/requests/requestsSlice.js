import { createSlice, nanoid } from "@reduxjs/toolkit";


const initialState = {
    items: [],
};


const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        addRequest: {
            reducer(state, { payload }) { state.items.unshift(payload); },
            prepare(data) { return { payload: { id: nanoid(), date: new Date().toISOString().slice(0, 10), status: "new", ...data } }; },
        },
        updateRequest(state, { payload }) {
            const i = state.items.findIndex((x) => x.id === payload.id);
            if (i >= 0) state.items[i] = { ...state.items[i], ...payload };
        },
    },
});


export const { addRequest, updateRequest} = requestsSlice.actions;
export default requestsSlice.reducer;
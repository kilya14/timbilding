import { configureStore } from "@reduxjs/toolkit";
import siteReducer from "../features/site/siteSlice";
import programsReducer from "../features/programs/programsSlice";
import requestsReducer from "../features/requests/requestsSlice";


export const store = configureStore({
    reducer: {
        site: siteReducer,
        programs: programsReducer,
        requests: requestsReducer,
    },
});
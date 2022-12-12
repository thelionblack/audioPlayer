import {configureStore, createSlice} from '@reduxjs/toolkit'
import playerReducer from "./slices/playerSlice";

export const store = configureStore({
    reducer: {
        playerReducer
    },
})
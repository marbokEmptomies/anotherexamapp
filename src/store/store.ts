import { configureStore } from "@reduxjs/toolkit/react";
import { useDispatch } from 'react-redux';
import rootReducer from "./rootReducer";

const store = configureStore({
    reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch
export type AppState = ReturnType<typeof store.getState>

export default store;
import { combineReducers } from "@reduxjs/toolkit";
export * from "../../types/types"
import examsReducer from "../features/exams/examsSlice";

const rootReducer = combineReducers({
    exams: examsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
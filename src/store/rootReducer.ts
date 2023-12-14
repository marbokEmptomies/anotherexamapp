import { combineReducers } from "@reduxjs/toolkit";
export * from "../../types/types"
import examsReducer from "../features/exams/examsSlice";
import userReducer from '../features/users/userSlice';

const rootReducer = combineReducers({
    exams: examsReducer,
    users: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
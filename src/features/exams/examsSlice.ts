import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllExams } from "../../services/examsApi";
import { RootState } from "../../store/rootReducer";
import { ExamState, Exam, Question, AnswerOption } from "../../../types/types";

const initialState: ExamState = {
  exams: [],
  status: 'idle',
  error: null
};

export const fetchExams = createAsyncThunk('exams/fetchExams', async () => {
    return await getAllExams();
}) 

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    addExam: (state, action: PayloadAction<Exam>) => {
      state.exams.push(action.payload);
    },
    updateExam: (state, action: PayloadAction<Exam>) => {
      const { id } = action.payload;
      const existingExam = state.exams.find((exam) => exam.id === id);
      if (existingExam) {
        Object.assign(existingExam, action.payload);
      }
    },
    deleteExam: (state, action: PayloadAction<string>) => {
        state.exams = state.exams.filter((exam) => exam.id !== action.payload)
    },
    addQuestion: (
      state,
      action: PayloadAction<{ examId: string; question: Question }>
    ) => {
      const { examId, question } = action.payload;
      const exam = state.exams.find((exam) => exam.id === examId);
      if (exam) {
        exam.questions.push(question);
      } else {
        console.error("Error adding a question!");
      }
    },
    updateQuestion: (
      state,
      action: PayloadAction<{ examId: string; question: Question }>
    ) => {
      const { examId, question } = action.payload;
      const exam = state.exams.find((exam) => exam.id === examId);
      if (exam) {
        const existingQuestion = exam.questions.find(
          (q) => q.id === question.id
        );
        if (existingQuestion) {
          Object.assign(existingQuestion, question);
        }
      }
    },
    deleteQuestion: (
      state,
      action: PayloadAction<{ examId: string; questionId: string }>
    ) => {
      const { examId, questionId } = action.payload;
      const exam = state.exams.find((exam) => exam.id === examId);
      if (exam) {
        exam.questions = exam.questions.filter(
          (question) => question.id !== questionId
        );
      }
    },
    addAnswerOption: (
      state,
      action: PayloadAction<{
        examId: string;
        questionId: string;
        answerOption: AnswerOption;
      }>
    ) => {
      const { examId, questionId, answerOption } = action.payload;
      const exam = state.exams.find((exam) => exam.id === examId);
      if (exam) {
        const question = exam.questions.find(
          (question) => question.id === questionId
        );
        if (question) {
          question.answerOptions.push(answerOption);
        }
      }
    },
    updateAnswerOption: (
      state,
      action: PayloadAction<{
        examId: string;
        questionId: string;
        answerOptionId: string;
        updates: Partial<AnswerOption>;
      }>
    ) => {
      const { examId, questionId, answerOptionId, updates } = action.payload;
      const exam = state.exams.find((exam) => exam.id === examId);
      if (exam) {
        const question = exam.questions.find((q) => q.id === questionId);
        if (question) {
          const answerOption = question.answerOptions.find(
            (aOption) => aOption.id === answerOptionId
          );
          if (answerOption) {
            Object.assign(answerOption, updates);
          }
        }
      }
    },
    deleteAnswerOption: (
      state,
      action: PayloadAction<{
        examId: string;
        questionId: string;
        answerOptionId: string;
      }>
    ) => {
      const { examId, questionId, answerOptionId } = action.payload;
      const exam = state.exams.find((exam) => exam.id === examId);
      if (exam) {
        const question = exam.questions.find((q) => q.id === questionId);
        if (question) {
          question.answerOptions = question.answerOptions.filter(
            (option) => option.id !== answerOptionId
          );
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchExams.fulfilled, (state, action) => {
            state.exams = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchExams.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchExams.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message || null;
        })
  }
});

export const {
  addExam,
  updateExam,
  deleteExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswerOption,
  updateAnswerOption,
  deleteAnswerOption,
} = examsSlice.actions;

export const selectExams = (state: RootState) => state.exams.exams;
export default examsSlice.reducer;

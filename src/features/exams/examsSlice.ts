import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllExams,
  createExam,
  deleteExam,
  updateExam,
} from "../../services/examsApi";
import {
  createQuestion as createQuestionApi,
  /* deleteQuestion as deleteQuestionApi,
  updateQuestion as updateQuestionApi, */
} from "../../services/questionApi";
import { RootState } from "../../store/rootReducer";
import { ExamState, Exam, Question, AnswerOption } from "../../../types/types";

const initialState: ExamState = {
  exams: [],
  status: "idle",
  error: null,
};

export const fetchExams = createAsyncThunk("exams/fetchExams", async () => {
  return await getAllExams();
});

export const postExam = createAsyncThunk(
  "/exams/createExam",
  async (newExam: Exam) => {
    return await createExam(newExam);
  }
);

export const updateExamById = createAsyncThunk(
  "/exams/updateExam",
  async (updatedExam: Exam) => {
    await updateExam(updatedExam);
    return updatedExam;
  }
);

export const deleteExamById = createAsyncThunk(
  "/exams/deleteExamById",
  async (examId: string) => {
    await deleteExam(examId);
    return examId;
  }
);

//QUESTIONS:
export const createQuestion = createAsyncThunk(
  "/questions/createQuestion",
  async ({ examId, question }: { examId: string; question: Question }) => {
    const response = await createQuestionApi(question);
    return { examId, question: response };
  }
);

/* export const updateQuestion = createAsyncThunk(
  "/questions/updateQuestion",
  async ({ examId, question }: { examId: string; question: Question }) => {
    const response = await updateQuestionApi(question);
    return { examId, question: response };
  }
);

export const deleteQuestion = createAsyncThunk(
  "/questions/deleteQuestion",
  async ({ examId, questionId }: { examId: string; questionId: string }) => {
    await deleteQuestionApi(examId, questionId);
    return { examId, questionId };
  }
); */

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    /* addQuestion: (
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
    }, */
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
      .addCase(postExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(postExam.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postExam.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteExamById.fulfilled, (state, action) => {
        state.exams = state.exams.filter((exam) => exam.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteExamById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteExamById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateExamById.fulfilled, (state, action) => {
        const updatedExam = action.payload;
        const index = state.exams.findIndex(
          (exam) => exam.id === updatedExam.id
        );

        if (index !== -1) {
          state.exams[index] = updatedExam;
        }
        state.status = "succeeded";
      })
      .addCase(updateExamById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateExamById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        const { examId, question } = action.payload;
        const exam = state.exams.find((exam) => exam.id === examId);
        if (exam) {
          exam.questions.push(question);
        }
        state.status = "succeeded";
      })
      .addCase(createQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      /* .addCase(updateQuestion.fulfilled, (state, action) => {
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
      })
      .addCase(updateQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const { examId, questionId } = action.payload;
        const exam = state.exams.find((exam) => exam.id === examId);
        if (exam) {
          exam.questions = exam.questions.filter(
            (question) => question.id !== questionId
          );
        }
        state.status = "succeeded";
      }) */
      /* .addCase(deleteQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      }) */
  },
});

export const {
  updateQuestion,
  deleteQuestion,
  addAnswerOption,
  updateAnswerOption,
  deleteAnswerOption,
} = examsSlice.actions;

export const selectExams = (state: RootState) => state.exams.exams;
export default examsSlice.reducer;

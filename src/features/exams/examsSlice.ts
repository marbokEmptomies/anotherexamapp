import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllExams,
  createExam,
  deleteExam,
  updateExam,
} from "../../services/examsApi";
import {
  createQuestion as createQuestionApi,
  updateQuestion as updateQuestionApi,
  deleteQuestion as deleteQuestionApi,
} from "../../services/questionApi";
import {
  createAnswerOption as createAnswerOptionApi,
  updateAnswerOption as updateAnswerOptionApi,
  deleteAnswerOption as deleteAnswerOptionApi,
} from "../../services/answerOptionApi";
import { RootState } from "../../store/rootReducer";
import {
  ExamState,
  Exam,
  Question,
  AnswerOption,
} from "../../server/types/types";

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
  async (examId: number) => {
    await deleteExam(examId);
    return examId;
  }
);

//QUESTIONS:
export const createQuestion = createAsyncThunk(
  "/questions/createQuestion",
  async (newQuestion: Question) => {
    console.log("createExam: ", newQuestion);
    return await createQuestionApi(newQuestion);
  }
);

export const updateQuestion = createAsyncThunk(
  "/questions/updateQuestion",
  async (updatedQuestion: Question) => {
    console.log("updatedQuestion thunk: ", updatedQuestion);
    await updateQuestionApi(updatedQuestion);
    return updatedQuestion;
  }
);

export const deleteQuestion = createAsyncThunk(
  "/questions/deleteQuestion",
  async (id: number) => {
    console.log("Del ID:", id);
    await deleteQuestionApi(id);
    return id;
  }
);

//Answer options
export const createAnswerOption = createAsyncThunk(
  "/options/createAnswerOption",
  async ({
    questionId,
    answerOptionText,
    isCorrect,
  }: {
    questionId: number;
    answerOptionText: string;
    isCorrect: boolean;
  }) => {
    console.log(
      "create answer option:",
      questionId,
      answerOptionText,
      isCorrect
    );
    const response = await createAnswerOptionApi({
      questionId,
      answerOptionText,
      isCorrect,
    });
    return response;
  }
);

export const updateAnswerOption = createAsyncThunk(
  "/options/updateAnswerOption",
  async (updatedAnswerOption: AnswerOption) => {
    console.log("updatedQuestion thunk: ", updatedAnswerOption);
    await updateAnswerOptionApi(updatedAnswerOption);
    return updatedAnswerOption;
  }
);

export const deleteAnswerOption = createAsyncThunk(
  'options/deleteAnswerOption',
  async (answerOptionId: number) => {
    await deleteAnswerOptionApi(answerOptionId);
    return answerOptionId;
  }
);

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    /* updateQuestion: (
      state,
      action: PayloadAction<{ examId: number; question: Question }>
    ) => {
      const { examId, question } = action.payload;
      const exam = state.exams.find((exam) => exam.exam_id === examId);
      if (exam) {
        const existingQuestion = exam.questions.find(
          (q) => q.id === question.id
        );
        if (existingQuestion) {
          Object.assign(existingQuestion, question);
        }
      }
    },  */
    /* deleteQuestion: (
      state,
      action: PayloadAction<{ examId: number; questionId: number }>
    ) => {
      const { examId, questionId } = action.payload;
      const exam = state.exams.find((exam) => exam.exam_id === examId);
      if (exam) {
        exam.questions = exam.questions.filter(
          (question) => question.id !== questionId
        );
      }
    }, */
    /* addAnswerOption: (
      state,
      action: PayloadAction<{
        examId: number;
        questionId: number;
        answerOption: AnswerOption;
      }>
    ) => {
      const { examId, questionId, answerOption } = action.payload;
      const exam = state.exams.find((exam) => exam.exam_id === examId);
      if (exam) {
        const question = exam.questions.find(
          (question) => question.id === questionId
        );
        if (question) {
          question.answer_options.push(answerOption);
        }
      }
    }, */
    /* updateAnswerOption: (
      state,
      action: PayloadAction<{
        examId: number;
        questionId: number;
        answerOptionId: number;
        updates: Partial<AnswerOption>;
      }>
    ) => {
      const { examId, questionId, answerOptionId, updates } = action.payload;
      const exam = state.exams.find((exam) => exam.exam_id === examId);
      if (exam) {
        const question = exam.questions.find((q) => q.id === questionId);
        if (question) {
          const answerOption = question.answer_options.find(
            (aOption) => aOption.id === answerOptionId
          );
          if (answerOption) {
            Object.assign(answerOption, updates);
          }
        }
      }
    }, */
    /* deleteAnswerOption: (
      state,
      action: PayloadAction<{
        examId: number;
        questionId: number;
        answerOptionId: number;
      }>
    ) => {
      const { examId, questionId, answerOptionId } = action.payload;
      const exam = state.exams.find((exam) => exam.exam_id === examId);
      if (exam) {
        const question = exam.questions.find((q) => q.id === questionId);
        if (question) {
          question.answer_options = question.answer_options.filter(
            (option) => option.id !== answerOptionId
          );
        }
      }
    }, */
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload;
        console.log("exams fetched: ", state.exams);
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
        console.log("create exam: ", action.payload);
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
        state.exams = state.exams.filter(
          (exam) => exam.id !== action.payload
        );
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
        const examId = action.payload.exam_id;
        console.log("NewQ:", action.payload);
        const exam = state.exams.find((exam) => exam.id === examId);
        if (exam) {
          exam.questions.push(action.payload);
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
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const exam = state.exams.find(
          (exam) => exam.id === action.payload.exam_id
        );

        if (exam) {
          const existingQuestion = exam.questions.find(
            (question) => question.id === action.payload.id
          );

          if (existingQuestion) {
            // Update the existing question in the state with the new data
            Object.assign(existingQuestion, action.payload);
          }
        }

        state.status = "succeeded";
      })
      .addCase(updateQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const questionToDelete = action.payload;
        for (const exam of state.exams) {
          const updatedQuestions = exam.questions.filter(
            (question) => question.id !== questionToDelete
          );
          exam.questions = updatedQuestions;
        }
        state.status = "succeeded";
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(createAnswerOption.fulfilled, (state, action) => {
        console.log("New_AO:", action.payload);
        for (const exam of state.exams) {
          const q = exam.questions.find(
            (question) => question.id === action.payload.question_id
          );
          if (q) {
            const existingAnswerOption = q.answer_options.find(
              (ao) => ao.id === action.payload.id
            );

            if (!existingAnswerOption) {
              q.answer_options.push(action.payload);
            }
          }
        }

        state.status = "succeeded";
      })
      .addCase(createAnswerOption.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAnswerOption.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateAnswerOption.fulfilled, (state, action) => {
        console.log("UD_AO: ", action.payload)
        //TODO
        state.status = "succeeded";
      })
      .addCase(updateAnswerOption.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAnswerOption.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteAnswerOption.fulfilled, (state, action) => {
        const answerToDelete = action.payload;
        for (const exam of state.exams) {
          for(const question of exam.questions){
            const updatedAnswers = question.answer_options.filter(
              (ao) => ao.id !== answerToDelete
            );
            question.answer_options = updatedAnswers;
          }
        }
        state.status = "succeeded";
      })
      .addCase(deleteAnswerOption.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAnswerOption.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
  },
});

/* export const {deleteAnswerOption } =
  examsSlice.actions; */

export const selectExams = (state: RootState) => state.exams.exams;
export default examsSlice.reducer;

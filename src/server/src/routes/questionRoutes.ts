import express, { Router, Request, Response } from "express";
import { readMockData, writeMockData } from "../index";
import {Exam} from '../../../../types/types'

interface Question {
  id: string;
  examId: string;
  questionText: string;
  answerOptions: [];
}

const router: Router = express.Router();

router.post("/", (req: Request, res: Response) => {
    try {
        const { examId, ...newQuestionData } = req.body;
        let data = readMockData();
        let exams = data.exams;
        const examIndex = exams.findIndex((exam: any) => exam.id === examId);

        if (examIndex !== -1) {
            const newQuestion = {examId, ...newQuestionData}
            exams[examIndex].questions.push(newQuestion);
            writeMockData(data); // Use the entire data object to update exams
            res.json(newQuestionData);
        } else {
            res.status(404).json({ error: "Exam not found" });
        }
    } catch (error) {
        console.error("Error creating question: ", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.put("/:id", (req: Request, res: Response) => {
    try {
        const { examId, ...updatedQuestionData } = req.body;
        let data = readMockData();
        const exams = data.exams;
        const examIndex = exams.findIndex((exam: any) => exam.id === examId);

        if (examIndex !== -1) {
            const questions = exams[examIndex].questions;
            const questionIndex = questions.findIndex((question: any) => question.id === req.params.id);

            if (questionIndex !== -1) {
                exams[examIndex].questions[questionIndex] = { examId: examId, id: req.params.id, ...updatedQuestionData };
                writeMockData(data); // Use the entire data object to update exams
                res.json({ examId: examId, id: req.params.id, ...updatedQuestionData });
            } else {
                res.status(404).json({ error: "Question not found" });
            }
        } else {
            res.status(404).json({ error: "Exam not found" });
        }
    } catch (error) {
        console.error("Error updating a question: ", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.delete("/:examId/:questionId", (req: Request, res: Response) => {
    try {
        let { exams } = readMockData();
        const examId = req.params.examId;
        const questionId = req.params.questionId;

        const examIndex = exams.findIndex((exam: Exam) => exam.id === examId);

        if (examIndex !== -1) {
            const questions = exams[examIndex].questions;
            const questionIndex = questions.findIndex((question: Question) => question.id === questionId);

            if (questionIndex !== -1) {
                exams[examIndex].questions.splice(questionIndex, 1);
                writeMockData({ exams });
                res.json({ message: "Question deleted successfully" });
            } else {
                res.status(404).json({ error: "Question not found" });
            }
        } else {
            res.status(404).json({ error: "Exam not found" });
        }
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;

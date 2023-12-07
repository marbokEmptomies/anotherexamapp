import express, { Router, Request, Response } from "express";
import { readMockData, writeMockData } from "../index";

interface Exam {
  id: string;
  name: string;
  maxScore: number;
  questions: [];
}

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  try {
    const { exams } = readMockData();
    res.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", (req: Request, res: Response) => {
  try {
    const { exams } = readMockData();
    const newExam: Exam = req.body;
    exams.push(newExam);
    writeMockData({ exams });
    res.json(newExam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", (req: Request, res: Response) => {
  try {
    const { exams } = readMockData();
    const examId = req.params.id;
    const updatedExamData: Exam[] = exams.map((exam: Exam) => {
      if (exam.id === examId) {
        return {
          ...exam,
          name: req.body.name || exam.name,
          maxScore: req.body.maxScore || exam.maxScore,
        };
      }
      return exam;
    });

    // Update the mockData
    writeMockData({ exams: updatedExamData });

    res.json({ message: "Exam updated successfully" });
  } catch (error) {
    console.error("Error updating exam: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  try {
    let { exams } = readMockData();
    const examId = req.params.id;
    exams = exams.filter((exam: Exam) => exam.id !== examId);
    writeMockData({ exams });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

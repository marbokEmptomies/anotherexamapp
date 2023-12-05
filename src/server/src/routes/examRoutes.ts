import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

//Mock data:
let exams = [
  { id: "1001", name: "Tentti1", maxScore: 100, questions: [] },
  { id: "1002", name: "Tentti2", maxScore: 100, questions: [] },
];

router.get("/", (req: Request, res: Response) => {
  try {
    res.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  try {
    const examId = req.params.id;
    const examById = exams.find((exam) => exam.id === examId);
    if (examById) {
      res.json({message: `Exam with id ${examId}:`, data: examById});
    } else {
      res.status(404).json({ error: `Exam with id ${examId} not found` });
    }
  } catch (error) {
    console.error("Error fetching exam by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", (req: Request, res: Response) => {
  try {
    const newExam = req.body;
    exams.push(newExam);
    res.json(newExam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  try {
    const examId = req.params.id;
    exams = exams.filter((exam) => exam.id !== examId);
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

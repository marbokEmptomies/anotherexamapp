import express, { Router, Request, Response } from "express";
import { Exam } from "../../types/types";
import db from "../db";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await db.query(
      `SELECT 
      e.id AS exam_id, 
      e.name, 
      COALESCE(
        (
          SELECT 
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'question_id', q.id, 
                'question_text', q.question_text, 
                'answer_options', COALESCE(
                  (
                    SELECT 
                      JSON_AGG(
                        JSON_BUILD_OBJECT(
                          'answer_option_id', ao.id, 
                          'answer_text', ao.answer_text, 
                          'is_correct', ao.is_correct
                        )
                      )::jsonb
                    FROM 
                      answer_option ao 
                    WHERE 
                      ao.question_id = q.id
                  ),
                  '[]'::jsonb
                )::jsonb
              )
            )::json -- Explicitly cast to json
          FROM 
            question q 
          WHERE 
            q.exam_id = e.id
        ),
        '[]'::json -- Replace NULL with an empty array
      )::json AS questions
    FROM 
      exam e
    ORDER BY 
      e.id;    
    `

      /* SELECT 
        e.id AS exam_id, 
        e.name, 
        q.id AS question_id, 
        q.question_text, 
        ao.id AS answer_option_id, 
        ao.answer_text, 
        ao.is_correct 
      FROM 
        exam e 
      JOIN 
        question q ON e.id = q.exam_id 
      JOIN 
        answer_option ao ON q.id = ao.question_id 
      ORDER BY 
        e.id, q.id, ao.id` */
    );

    res.status(200).json(data.rows);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newExam: Exam = req.body;

    const insertExamQuery = `
      INSERT INTO exam (name)
      VALUES ($1)
      RETURNING *`;

    const insertedExam = await db.query(insertExamQuery, [newExam.name]);
    res
      .status(200)
      .json({
        message: "Exam created successfully!",
        data: insertedExam.rows[0]
      });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const examId = req.params.id;
    const { name } = req.body;

    const updateExamQuery = `
      UPDATE exam
      SET name = $1
      WHERE id = $2
      RETURNING *`;

    const updatedExam = await db.query(updateExamQuery, [name, examId]);
    res
      .status(201)
      .json({
        message: "Exam updated successfully! ",
        data: updatedExam.rows[0],
      });
  } catch (error) {
    console.error("Error updating exam: ", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const examId = req.params.id;

    //Using transaction to perform a cascade delete
    await db.query("BEGIN");

    //delete answer options
    await db.query(
      `DELETE FROM answer_option WHERE question_id IN (SELECT id FROM question WHERE exam_id = $1)`,
      [examId]
    );

    //delete questions
    await db.query(`DELETE FROM question WHERE exam_id = $1`, [examId]);

    //delete the exam
    const deleteExamQuery = `DELETE FROM exam WHERE id = $1 RETURNING *`;
    const deletedExam = await db.query(deleteExamQuery, [examId]);

    //commit the transaction
    await db.query("COMMIT");

    if (deletedExam.rows.length === 0) {
      res.status(404).json({ error: "Exam not found" });
    } else {
      res
        .status(200)
        .json({
          message: "Exam and associated data successfully deleted",
          data: deletedExam.rows[0],
        });
    }
  } catch (error) {
    //rollback the transaction in case of an error
    await db.query("ROLLBACK");
    console.error("Error deleting exam: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

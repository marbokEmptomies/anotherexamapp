import express, { Router, Request, Response } from "express";
import db from "../db";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const {examId, questionText} = req.body;

        //check if the exam exists
        const examResult = await db.query(`SELECT * FROM exam WHERE id = $1`, [examId]);
        const examExists = examResult.rows.length > 0;

        if(!examExists){
            return res.status(404).json({error: "Exam not found."})
        }
        
        //insert the question into the "question" table
        const data = await db.query(`INSERT INTO question (exam_id, question_text) VALUES ($1, $2) RETURNING *`, [examId, questionText]);

        res.status(200).json({message: "Question added successfully", data: data.rows[0]})
    } catch (error) {
        console.error("Error creating question: ", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const questionId = req.params.id;
        const {questionText} = req.body;

        console.log("UpdateQ body: ", req.body)
        
        //check if the question exists
        const questionResult = await db.query(`SELECT * FROM question WHERE id = $1`, [questionId]);
        const questionExists = questionResult.rows.length > 0;

        if(!questionExists){
            return res.status(404).json({error: "Question not found"})
        };

        //update the question in the "question" table
        const data = await db.query(`UPDATE question SET question_text = $1 WHERE id = $2 RETURNING *`, [questionText, questionId]);

        res.status(200).json({message: "Question updated successfully!", data: data});
    } catch (error) {
        console.error("Error updating a question: ", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const questionId = req.params.id;

        //begin transaction
        await db.query('BEGIN');

        //delete answer options
        await db.query(`DELETE FROM answer_option WHERE question_id = $1`, [questionId]);

        //delete question
        const deleteQuestionQuery = `DELETE FROM question WHERE id = $1 RETURNING *`
        const deletedQuestion = await db.query(deleteQuestionQuery, [questionId])

        //commit the transaction
        await db.query('COMMIT')

        //check if the question exists
        if(deletedQuestion.rows.length === 0){
            res.status(404).json({error: "Question not found"});
          }else {
            res.status(200).json({message: "Question and associated data successfully deleted", data: deletedQuestion.rows[0]})
          }

    } catch (error) {
        //rollback in case on an error
        await db.query('ROLLBACK')
        console.error("Error deleting question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;

import express, { Router, Request, Response } from "express";
import db from "../db";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const {questionId, answerOptionText, isCorrect} = req.body;

        //check if the question exists
        const questionResult = await db.query(`SELECT * FROM question WHERE id = $1`, [questionId]);
        const questionExists = questionResult.rows.length > 0;

        if(!questionExists){
            return res.status(404).json({error: "Question not found."})
        }
        
        //insert the question into the "question" table
        const data = await db.query(`INSERT INTO answer_option (question_id, answer_text, is_correct) VALUES ($1, $2, $3) RETURNING *`, [questionId, answerOptionText, isCorrect]);

        res.status(200).json({message: "Answer option added successfully", data:data.rows[0]})
    } catch (error) {
        console.error("Error creating answer option: ", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const answerOptionId = req.params.id;
        const {answerOptionText, isCorrect, question_id} = req.body;
        
        //check if the answer option exists
        const optionResult = await db.query(`SELECT * FROM answer_option WHERE id = $1`, [answerOptionId]);
        const optionExists = optionResult.rows.length > 0;

        if(!optionExists){
            return res.status(404).json({error: "Answer option not found"})
        };

        //update the question in the "question" table
        const data = await db.query(`UPDATE answer_option SET answer_text = $1, is_correct = $2, question_id = $3 WHERE id = $4 RETURNING *`, [answerOptionText, isCorrect, question_id, answerOptionId]);

        res.status(200).json({message: "Answer option updated successfully!", data: data.rows[0]});
    } catch (error) {
        console.error("Error updating an answer option: ", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const answerOptionId = req.params.id;

        //delete answer option
        const deletedOption = await db.query(`DELETE FROM answer_option WHERE id = $1`, [answerOptionId]);
        res.status(200).json({message: "Answer option successfully deleted", data: deletedOption.rows[0]})
    } catch (error) {
        console.error("Error deleting answer option:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
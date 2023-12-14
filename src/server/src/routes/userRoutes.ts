import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { Router, Request, Response } from "express";
import db from '../db';

const router: Router = express.Router();

const saltRounds = 10;
const secretKey = 'ThisIsASecretKey..MonkeysForSale';

router.post('/register', async (req:Request, res:Response) => {
    const {firstName, lastName, email, password, role} = req.body;
    try {
        //check if a user with given email already exists
        const existingUserResult = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const existingUser = existingUserResult.rows[0];

        if(existingUser){
            return res.status(400).json({error: "User with this email already exists"})
        }

        //generate a salt and hash the password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        //insert new user to db with the hashed password
        const newUserResult = await db.query(`
            INSERT INTO users (firstname, lastname, email, password, role) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
            [firstName, lastName, email, hashedPassword, role]);

        const newUser = newUserResult.rows[0];
        res.status(200).json({message: "New user successfully added", data: newUser})

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({error: "Internal server error"})
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;

    try {
        //check if the user with the given email exists
        const userResult = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = userResult.rows[0];
        
        if(!user){
            return res.status(404).json({error: "Invalid credentials"});
        }

        //verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return res.status(401).json({error: "Invalid credentials, password doesn't match."})
        }

        //generate jwt
        const token = jwt.sign({userId: user.id, role: user.role}, secretKey, {expiresIn: "2h"});

        //send the token in the response
        res.status(200).json({message: "Successfully logged in.", token: token})
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).json({error: 'Internal server error'})
    }
})

export default router
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { Router, Request, Response } from "express";
import {User} from "../../types/types"

const router: Router = express.Router();

//Registration endpoint
router.post('/register', async (req:Request, res:Response) => {
    try {
        const {username, email, password} : User = req.body;

        //Check if user already exists
        if(users.some((user : User) => user.email === email)) {
            return res.status(400).json({message: 'Email alredy registered.'});
        }

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Save user to db
        const newUser = {id: users.length.toString(), username, email, password: hashedPassword};
        users.push(newUser);

        res.status(200).json({message: "Registration successful"});

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({error: "Internal server error"})
    }
});

//Login endpoint
router.post('/login', async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        //Find users by email
        const user = users.find((u) => u.email === email);

        if(!user){
            return res.status(401).json({message: "Invalid credentials"})
        }

        //Check password
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.status(401).json({message: 'Invalid credentials'})
        };

        const token = jwt.sign({userId: user.id, userName: user.username, role: 'admin'}, secretKey, {
            expiresIn: '2h',
        });

        res.status(200).json({token});
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).json({error: 'Internal server error'})
    }
})

export default router
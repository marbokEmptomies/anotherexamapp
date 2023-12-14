import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import examRoutes from "./routes/examRoutes";
import questionRoutes from "./routes/questionRoutes";
import answerOptionRoutes from "./routes/answerOptionRoutes";
import userRoutes from "./routes/userRoutes";


/* export const saltRounds = process.env.SALT_ROUNDS
export const secretKey = process.env.SECRET_KEY */

const app: Express = express();
/* const port = process.env.PORT || 3001; */

//Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (req: Request, res: Response) => {
  res.send("ROOT ROUTE");
});

//Routes
app.use("/exams", examRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerOptionRoutes);
app.use('/users', userRoutes)

const options = {
    key:fs.readFileSync(path.join(__dirname,'../cert/privateKey.key')),
    cert:fs.readFileSync(path.join(__dirname,'../cert/certificate.crt'))
};
const sslServer = https.createServer(options, app);
sslServer.listen(1337, () => {
  console.log("Secure server is listening on port 1337");
});

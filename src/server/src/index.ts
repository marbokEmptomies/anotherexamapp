import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import examRoutes from "./routes/examRoutes";
import questionRoutes from "./routes/questionRoutes";
import answerOptionRoutes from "./routes/answerOptionRoutes";

dotenv.config();
const app: Express = express();
/* const port = process.env.PORT || 3001; */

const secretKey = 'ThisIsASecretKey..MonkeysForSale';

//Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173" }));

const examDataPath = "./examData.json";

//DB Simulation:
const users: {id: string; username: string; email: string; password: string}[] = [];

export const readMockData = () => {
  const filePath = path.join(__dirname, examDataPath);
  const rawData = fs.readFileSync(filePath, "utf-8");

  try {
    const parsedData = JSON.parse(rawData);
    console.log("Parsed Data:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return undefined;
  }
};

export const writeMockData = (data: any) => {
  const filePath = path.join(__dirname, examDataPath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

app.get("/", (req: Request, res: Response) => {
  res.send("ROOT ROUTE");
});

//Routes
app.use("/exams", examRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerOptionRoutes);
//app.use('/users', userRoutes)

const options = {
    key:fs.readFileSync(path.join(__dirname,'../cert/privateKey.key')),
    cert:fs.readFileSync(path.join(__dirname,'../cert/certificate.crt'))
};
const sslServer = https.createServer(options, app);
sslServer.listen(1337, () => {
  console.log("Secure server is listening on port 1337");
});

/* app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */

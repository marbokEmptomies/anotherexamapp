import dotenv from 'dotenv';
import express, {Express, Request, Response} from 'express'; 
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import examRoutes from './routes/examRoutes';

dotenv.config();
const app : Express = express();
const port = process.env.PORT || 3001;

//Middleware
app.use(bodyParser.json());
app.use(cors({origin: "http://localhost:5173"}));

const examDataPath = './examData.json';

export const readMockData = () => {
    const filePath = path.join(__dirname, examDataPath);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData)
}

export const writeMockData = (data: any) => {
    const filePath = path.join(__dirname, examDataPath)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

app.get('/', (req: Request, res: Response) => {
    res.send("ROOT ROUTE")
})

//Routes
app.use('/exams', examRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
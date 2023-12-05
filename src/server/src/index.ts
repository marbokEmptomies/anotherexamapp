import dotenv from 'dotenv';
import express, {Express, Request, Response} from 'express'; 
import bodyParser from 'body-parser';
import cors from 'cors';
import examRoutes from './routes/examRoutes';

dotenv.config();
const app : Express = express();
const port = process.env.PORT || 3001;

//Middleware
app.use(bodyParser.json());
app.use(cors({origin: "http://localhost:5173"}));

app.get('/', (req: Request, res: Response) => {
    res.send("ROOT ROUTE")
})

//Routes
app.use('/exams', examRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
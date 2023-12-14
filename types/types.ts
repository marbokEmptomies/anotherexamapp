import {v4 as uuidv4} from 'uuid';

export const uuid = () => {
    return uuidv4();
}

export interface ExamState {
    exams: Exam[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface Exam {
    id: string,
    isCompleted: boolean,
    name: string,   
    questions: Question[],
}

export interface Question {
    examId: string,
    id: string,
    questionText: string,
    answerOptions: AnswerOption[];
}

export interface AnswerOption {
    questionId: string,
    id: string,
    answerOptionText: string,
    isCorrect: boolean,
}

export interface User {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'admin' | 'user'
}
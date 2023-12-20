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
    exam_id: number,
    name: string,   
    questions: Question[],
}

export interface Question {
    exam_id: number,
    id: number,
    question_text: string,
    answer_options: AnswerOption[];
}

export interface AnswerOption {
    id: number,
    answer_text: string,
    is_correct: boolean,
}

export interface User {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'admin' | 'user'
}
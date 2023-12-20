import axios from 'axios';
import {Question} from '../server/types/types';

const API_BASE_URL = "https://localhost:1337";

const api = axios.create({
    baseURL: API_BASE_URL
})

export const createQuestion = async ({ examId, questionText }: { examId: number; questionText: string }): Promise<Question> => {
    try {
        const response = await api.post(`/questions`, {examId, questionText});
        console.log("QuestionCreation response: ", response.data.data)
        return response.data.data;
    } catch (error) {
        console.error("Error creating question: ", error);
        throw error;
    }
}

export const updateQuestion = async (updatedQuestion: Question): Promise<Question> => {
    const newText = updatedQuestion.question_text
    console.log("UPDQ", updatedQuestion)
    try {
        const response = await api.put(`/questions/${updatedQuestion.id}`, {questionText: newText});
        return response.data;
    } catch (error) {
        console.error("Error updating question", error);
        throw error;     
    }
}

export const deleteQuestion = async (id: number): Promise<number> => {
    console.log("DELQ id: ", id)
    try {
        const response = await api.delete(`/questions/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting question: ", error);
        throw error;
    }
}
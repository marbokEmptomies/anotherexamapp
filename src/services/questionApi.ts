import axios from 'axios';
import {Question} from '../../types/types';

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
    baseURL: API_BASE_URL
})

export const createQuestion = async (newQuestion: Question): Promise<Question> => {
    try {
        const response = await api.post('/questions', newQuestion);
        console.log("QuestionCreation response: ", response.data)
        return response.data;
    } catch (error) {
        console.error("Error creating question: ", error);
        throw error;
    }
}

export const updateQuestion = async (updatedQuestion: Question): Promise<Question> => {
    try {
        const response = await api.put(`/questions/${updatedQuestion.id}`, updatedQuestion);
        console.log("updateQ API: ", response)
        return response.data;
    } catch (error) {
        console.error("Error updating question: ", error);
        throw error;
    }
}

export const deleteQuestion = async (examId: string, questionId: string): Promise<string> => {
    try {
        const response = await api.delete(`/questions/${examId}/${questionId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting question: ", error);
        throw error;
    }
}
import axios from 'axios';
import {Exam} from "../server/types/types";

const API_BASE_URL = "https://localhost:1337";

const api = axios.create({
    baseURL: API_BASE_URL
})

export const getAllExams = async () => {
    try {
        const response = await api.get('/exams');
        console.log("getAllExams Data: ", response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching exams: ", error);
        throw error;
    }
}

export const createExam = async (newExam: Exam): Promise<Exam> => {
    try {
        const response = await api.post('/exams', newExam);
        return response.data;
    } catch (error) {
        console.error("Error creating exam: ", error);
        throw error;
    }
}

export const updateExam = async (updatedExam: Exam): Promise<Exam> => {
    try {
        const response = await api.put(`/exams/${updatedExam.exam_id}`, updatedExam);
        return response.data;
    } catch (error) {
        console.error("Error updating exam", error);
        throw error;     
    }
}

export const deleteExam = async (examId: number): Promise<number> => {
    try {
        const response = await api.delete(`/exams/${examId}`)
        return response.data
    } catch (error) {
        console.error("Error deleting exam ", error)
        throw error;
    }
}
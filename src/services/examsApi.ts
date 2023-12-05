import axios from 'axios';

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
    baseURL: API_BASE_URL
})

export const getAllExams = async () => {
    try {
        const response = await api.get('/exams');
        return response.data;
    } catch (error) {
        console.error("Error fetching exams: ", error);
        throw error;
    }
}
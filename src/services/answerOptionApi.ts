import axios from 'axios';
import {AnswerOption} from '../server/types/types';

const API_BASE_URL = "https://localhost:1337";

const api = axios.create({
    baseURL: API_BASE_URL
})

export const createAnswerOption = async ({ questionId, answerOptionText, isCorrect }: { questionId: number; answerOptionText: string, isCorrect: boolean }): Promise<AnswerOption> => {
    try {
        const response = await api.post(`/answers`, {questionId, answerOptionText, isCorrect});
        console.log("AOCreation response: ", response.data.data)
        return response.data.data;
    } catch (error) {
        console.error("Error creating answer option: ", error);
        throw error;
    }
}

export const updateAnswerOption = async (updatedAnswerOption: AnswerOption): Promise<AnswerOption> => {
    const updateData = {
        answer_text: updatedAnswerOption.answer_text,
        is_correct: updatedAnswerOption.is_correct,
    }
    console.log("UD_AO", updateData)
    try {
        const response = await api.put(`/answers/${updatedAnswerOption.id}`, {updateData});
        console.log("UD_AO res: ", response)
        return response.data;
    } catch (error) {
        console.error("Error updating answer option", error);
        throw error;     
    }
}

export const deleteAnswerOption = async (id: number): Promise<number> => {
    console.log("DEL_AO id: ", id)
    try {
        const response = await api.delete(`/answers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting answer option: ", error);
        throw error;
    }
}
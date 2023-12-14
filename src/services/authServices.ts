import axios from "axios";
import { User } from "../server/types/types";

const API_BASE_URL = "https://localhost:1337/users";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (user: User) => {
  try {
    const response = await api.post("/register", user);
    return response.data;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    console.log("login response: ", response)
    return response;
  } catch (error) {
    console.error("Error in login: ", error);
    throw error;
  }
};

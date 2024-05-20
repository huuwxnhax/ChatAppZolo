import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL }); // http://localhost:5000

export const logIn = (formData) => API.post("/api/auth/login", formData);

export const signUp = (formData) => API.post("/api/auth/register", formData);

export const sendOtp = (username) =>
  API.post("/api/auth/send-otp", { username });

import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

export const createChat = (data) => API.post("/api/chat/", data);

export const userChats = (id) => API.get(`/api/chat/${id}`);

export const findChat = (firstId, secondId) =>
  API.get(`/api/chat/find/${firstId}/${secondId}`);

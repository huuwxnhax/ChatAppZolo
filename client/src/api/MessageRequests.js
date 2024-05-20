import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

export const getMessages = (id) => API.get(`/api/message/${id}`);

export const addMessage = (data) => API.post("/api/message/", data);

export const deleteMessage = (id) => API.delete(`/api/message/delete/${id}`);

export const deleteMessageOneSide = (id, data) =>
  API.delete(`/api/message/deleteoneside/${id}`, { data });

export const getHiddenMessagesForUser = (id, data) =>
  API.get(`/api/message/hidden/${id}`, { data });

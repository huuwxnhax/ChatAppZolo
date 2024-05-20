import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const getUser = (userId) => API.get(`/api/user/${userId}`);

export const updateUser = (id, formData) =>
  API.put(`/api/user/${id}`, formData);

export const getAllUser = () => API.get("/api/user");

export const followUser = (id, data) => API.put(`/api/user/${id}/follow`, data);

export const unfollowUser = (id, data) =>
  API.put(`/api/user/${id}/unfollow`, data);

export const changePassword = (data) =>
  API.post("/api/user/change-password", data);

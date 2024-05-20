import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

export const createChatGroup = (data) => API.post("/api/group", data);
export const userChatGroups = (id) => API.get(`/api/group/${id}`);
export const memberInGroups = (id) => API.get(`/api/group/members/${id}`);
export const addMembersToGroup = (data) =>
  API.post("/api/group/add-member", data);
export const removeMemberFromGroup = (data) =>
  API.post("/api/group/remove-member", data);
export const leaveGroup = (data) => API.post("/api/group/leave-group", data);
export const deleteGroup = (data) => API.post("/api/group/delete-group", data);

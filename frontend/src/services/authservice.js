import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // backend URL

export const signupUser = async ({ name,phone, password, district }) => {
  const res = await axios.post(`${API_URL}/signup`, { name,phone, password, district });
  return res.data;
};

export const loginUser = async ({ phone, password }) => {
  const res = await axios.post(`${API_URL}/login`, { phone, password });
  return res.data;
};

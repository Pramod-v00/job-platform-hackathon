import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export const getPendingJobs = async () => {
  const token = localStorage.getItem("adminToken");

  const res = await axios.get(`${API_URL}/pending-jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const approveJob = async (id) => {
  const token = localStorage.getItem("adminToken");

  return axios.put(
    `${API_URL}/approve/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const rejectJob = async (id) => {
  const token = localStorage.getItem("adminToken");

  return axios.delete(`${API_URL}/reject/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs"; // backend URL

// ✅ Create Job
export const postJob = async (formData, userPhone) => {
  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      phone: userPhone, // add user phone for authentication
    },
  });
  return res.data;
};

// ✅ Get Jobs by District
export const getJobsByDistrict = async (district) => {
  const res = await axios.get(`${API_URL}?district=${district}`);
  return res.data;
};

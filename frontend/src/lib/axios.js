import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
   headers: {
    "Content-Type": "application/json", // ✅ this is important
  }, // send cookies with the request
});
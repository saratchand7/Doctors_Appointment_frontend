
import axios from "axios";

const api = axios.create({
  baseURL: "https://doctors-appointment-backend-5.onrender.com",
  timeout: 10000
});

export default api;

import axios from "axios";
import { API_BASE } from "./context";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

export default api;
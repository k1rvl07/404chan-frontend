import { env } from "@utils";
import axios from "axios";

const API_URL = env.API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export { apiClient };

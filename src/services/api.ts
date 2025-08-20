import { useSessionStore } from "@stores";
import { env } from "@utils";
import axios from "axios";

const API_URL = env.API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  validateStatus: (status) => status >= 200 && status < 300,
});

apiClient.interceptors.request.use((config) => {
  const sessionKey = useSessionStore.getState().sessionKey;

  const params = new URLSearchParams(config.params);

  if (sessionKey) {
    params.set("session_key", sessionKey);
  }

  config.params = Object.fromEntries(params.entries());

  return config;
});

export { apiClient };

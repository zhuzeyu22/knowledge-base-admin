import axios from "axios";
import { accessUnitlogin, goUnifiedlogin } from "../utils/auth";

const service = axios.create({
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    if (!config.baseURL) {
      config.baseURL = import.meta.env.VITE_API_BASE_URL;
    }
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    config.headers["Authorization"] = getAccessToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function getAccessToken(): string | undefined {
  const token = localStorage.getItem("console_token");
  return token ? `Bearer ${token}` : undefined;
}

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // code 为2xx 进入到这里
    if (typeof res.code === "undefined") return res;

    if (res.code !== 200 && res.code !== 201) {
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    if (error.response.status === 401) {
      const certifiedName = localStorage.getItem("maasUser");
      console.log("401 certify", certifiedName);
      if (!certifiedName) {
        goUnifiedlogin();
      } else {
        accessUnitlogin();
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default service;

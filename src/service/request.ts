import axios, { AxiosInstance } from "axios";
import { accessUnitlogin, goUnifiedlogin } from "../utils/auth";

const service: AxiosInstance = axios.create({
  // 5 分钟，回归测试查询比较慢
  timeout: 5 * 60 * 1000,
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

    // 这里是业务层错误码
    if (res.code !== 200 && res.code !== 201) {
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    if (error.response.status === 401) {
      accessUnitlogin();
    } else {
      return Promise.reject(error);
    }
  }
);

export default service;

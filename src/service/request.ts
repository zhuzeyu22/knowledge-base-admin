import axios, { AxiosInstance } from "axios";
import { accessUnitlogin, goUnifiedlogin } from "../utils/auth";
import { ElMessage } from 'element-plus';

const service: AxiosInstance = axios.create({
  // 1 分钟，回归测试查询比较慢
  timeout: 60 * 1000,
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
    config.headers["authId"] = getAuthId();
    config.headers["roleId"] = getRoleId();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function getAuthId(): string | undefined {
  const authId = localStorage.getItem("authId")
  return authId || undefined
}

function getRoleId(): string | undefined {
  const roleId = localStorage.getItem("roleId")
  return roleId || undefined
}

function getAccessToken(): string | undefined {
  const token = localStorage.getItem("console_token");
  return token ? `Bearer ${token}` : undefined;
}

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // code 为2xx 进入到这里
    if (typeof res.code === "undefined") return res;

    // 越权访问
    if (res.code == 403) {
      ElMessage.error("权限异常");
      return Promise.reject(new Error(res?.message || "权限异常"));
    }
    // 这里是业务层错误码
    else if (res.code !== 200 && res.code !== 201) {
      return Promise.reject(new Error(res?.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    // 超时异常处理
    if (axios.isAxiosError(error) && error?.code == "ECONNABORTED" && error?.message?.includes("timeout")) {
      return Promise.reject(new Error("请求超时"));
    }
    // 越权访问
    else if (error?.response?.status === 403) {
      ElMessage.error("权限异常");
      return Promise.reject(new Error(error?.response?.data?.message || "权限异常"));
    }
    else if (error?.response?.status === 401) {
      accessUnitlogin();
      return;
    } else if (error.code === "ERR_CANCELED") {
      console.log("取消请求");
      return Promise.reject(new Error("取消请求"));
    } else if (error.code === "ECONNABORTED") {
      console.log("请求异常断开");
      return Promise.reject(new Error("请求异常断开"));
    }
    else {
      return Promise.reject(error?.response?.data?.message || error);
    }
  }
);

export default service;

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { accessUnitlogin } from '../utils/auth';
import { ElMessage } from 'element-plus';

// 创建取消令牌控制器映射
const pendingMap = new Map<string, AbortController>();

// 生成请求唯一标识
const getPendingKey = (config: AxiosRequestConfig): string => {
  return `${config.method}&${config.url}&${JSON.stringify(config.params)}&${JSON.stringify(config.data)}`;
};

// 添加请求到 pendingMap
const addPending = (config: AxiosRequestConfig): void => {
  removePending(config);
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(getPendingKey(config), controller);
};

// 移除请求
const removePending = (config: AxiosRequestConfig): void => {
  const key = getPendingKey(config);
  if (pendingMap.has(key)) {
    const controller = pendingMap.get(key);
    controller?.abort('重复请求被取消');
    pendingMap.delete(key);
  }
};

// 清除所有 pending 请求
export const clearPending = (): void => {
  pendingMap.forEach(controller => {
    controller.abort('页面切换，请求被取消');
  });
  pendingMap.clear();
};

// 从 localStorage 获取 token
const getAccessToken = (): string | undefined => {
  const token = localStorage.getItem('console_token');
  return token ? `Bearer ${token}` : undefined;
};

const getAuthId = (): string | undefined => {
  return localStorage.getItem('authId') || undefined;
};

const getRoleId = (): string | undefined => {
  return localStorage.getItem('roleId') || undefined;
};

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  timeout: 60 * 1000, // 5 分钟
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 设置 baseURL
    if (!config.baseURL) {
      config.baseURL = import.meta.env.VITE_API_BASE_URL;
    }

    // 设置请求头
    config.headers.Authorization = getAccessToken();
    config.headers.authId = getAuthId();
    config.headers.roleId = getRoleId();

    // 添加取消令牌（排除文件上传等特殊请求）
    if (!config.headers['X-Skip-Cancel']) {
      addPending(config);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成后移除 pending
    removePending(response.config);

    const res = response.data;

    // 如果返回的不是标准格式，直接返回
    if (typeof res.code === 'undefined') {
      return res;
    }

    // 业务层错误处理
    if (res.code !== 200 && res.code !== 201) {
      ElMessage.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || 'Error'));
    }

    return res;
  },
  error => {
    // 请求错误时移除 pending
    if (error.config) {
      removePending(error.config);
    }

    // 取消请求不显示错误
    if (error.name === 'CanceledError' || error.message?.includes('取消')) {
      return Promise.reject(error);
    }

    // 超时处理
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试');
      return Promise.reject(error);
    }

    // 401 未授权处理
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录');
      accessUnitlogin();
      return Promise.reject(error);
    }

    // 其他错误处理
    const message = error.response?.data?.message || error.message || '网络错误';
    ElMessage.error(message);

    return Promise.reject(error);
  }
);

export default service;

// 封装常用请求方法
export const request = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config);
  },
};

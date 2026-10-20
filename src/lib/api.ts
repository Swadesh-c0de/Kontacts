import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/proxy",
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
    if (typeof serverMsg === "string" && serverMsg.trim()) return serverMsg;
    if (typeof err.message === "string" && err.message.trim()) return err.message;
  }
  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }
  return fallback;
}

export function isValidToken(token: string | null): token is string {
  return Boolean(token && token !== "undefined" && token !== "null");
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (isValidToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthRoute = originalRequest.url?.includes("/users/login") || 
                        originalRequest.url?.includes("/users/register") || 
                        originalRequest.url?.includes("/users/refresh") ||
                        originalRequest.url?.includes("/users/logout");

    // Handle 401 with refresh token logic
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/users/refresh");
        const newToken = data?.accessToken;
        if (!newToken || typeof newToken !== "string") {
          throw new Error("Invalid refresh token");
        }
        
        if (typeof window !== "undefined") {
          localStorage.setItem("token", newToken);
        }
        
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.href = "/login";
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      console.error("Rate limit exceeded.");
      return Promise.reject(new Error("Too many requests. Please try again later."));
    }

    return Promise.reject(error);
  }
);

export default api;

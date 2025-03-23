import axios from "axios";
import {
  Application,
  CreateApplicationRequest,
  DisburseApplicationRequest,
  RepayApplicationRequest,
  CancelApplicationRequest,
  RejectApplicationRequest,
  ReleaseFundsRequest,
} from "../types/application";
import { User, CreateUserRequest } from "../types/user";

const API_BASE_URL = "http://localhost:3000/dev"; // Update with your API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      const code = error.response.status;
      const message = error.response.data.message || error.message;
      error.message = `${code}: ${message}`;
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  generateToken: async (role: "customer" | "admin"): Promise<string> => {
    const response = await api.post("/generate-token", { role });
    return response.data.token;
  },
};

// Application endpoints
export const applicationsApi = {
  create: async (data: CreateApplicationRequest): Promise<Application> => {
    const response = await api.post("/create-application", data);
    return response.data;
  },

  disburse: async (data: DisburseApplicationRequest): Promise<Application> => {
    const response = await api.post("/disburse-application", data);
    return response.data;
  },

  repay: async (data: RepayApplicationRequest): Promise<Application> => {
    const response = await api.post("/repay-application", data);
    return response.data;
  },

  cancel: async (data: CancelApplicationRequest): Promise<Application> => {
    const response = await api.post(`/cancel-application`, data);
    return response.data;
  },

  reject: async (data: RejectApplicationRequest): Promise<Application> => {
    const response = await api.post(`/reject-application`, data);
    return response.data;
  },

  list: async (): Promise<Application[]> => {
    const response = await api.get("/applications");
    return response.data;
  },

  getHistory: async (userId: string): Promise<Application[]> => {
    const response = await api.get(`/applications/history/${userId}`);
    return response.data;
  },

  releaseFunds: async (data: ReleaseFundsRequest): Promise<void> => {
    await api.post("/applications/release-funds", data);
  },
};

// User endpoints
export const usersApi = {
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post("/create-user", data);
    return response.data;
  },

  get: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  list: async (): Promise<User[]> => {
    const response = await api.get("/users/summary");
    return response.data;
  },
};

import axios from "axios";
import { Complaint, Stats, AIAnalysisResult, AIVerifyImageResult, UnifiedAIAnalysisResponse } from "../types";

const api = axios.create({
  baseURL: "/api",
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("civic_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const complaintService = {
  getAll: (params?: { status?: string; ward?: string; category?: string; q?: string; sortBy?: string }) =>
    api.get<Complaint[]>("/complaints", { params }),

  getById: (id: string) => 
    api.get<Complaint>(`/complaints/${id}`),

  create: (data: Partial<Complaint>) => 
    api.post<Complaint>("/complaints", data),

  update: (id: string, data: { status?: string; assignedDepartment?: string; officialComment?: string }) => 
    api.patch<Complaint>(`/complaints/${id}`, data),

  resolveWithEmail: (
    id: string,
    data: {
      afterImageUrl: string;
      resolutionNotes: string;
      officerName?: string;
      officerDepartment?: string;
      officerContact?: string;
    }
  ) =>
    api.post<{ complaint: Complaint; emailDetails: any; message?: string }>(`/complaints/${id}/resolve-email`, data),

  upvote: (id: string, userId?: string) => 
    api.post<{ upvote_count: number; upvotes: string[] }>(`/complaints/${id}/upvote`, { userId }),

  removeUpvote: (id: string, userId?: string) => 
    api.delete<{ upvote_count: number; upvotes: string[] }>(`/complaints/${id}/upvote`, { data: { userId } }),

  addComment: (id: string, text: string, userName?: string, userRole?: string) => 
    api.post(`/complaints/${id}/comments`, { text, userName, userRole }),

  getTop10: (ward?: string) => 
    api.get<Complaint[]>(`/complaints/top-10/${ward || "all"}`),

  getStats: () => 
    api.get<Stats>("/complaints/stats"),

  analyzeWithAI: (data: { title: string; description: string; category?: string; location?: string }) =>
    api.post<AIAnalysisResult>("/ai/analyze-issue", data),

  verifyImage: (data: { imageUrl: string; category: string; title?: string; description?: string }) =>
    api.post<AIVerifyImageResult>("/ai/verify-image", data),

  getWeatherAlerts: () =>
    api.get("/weather/alerts"),

  getEmergencyContacts: () =>
    api.get("/emergency/contacts"),

  getWardAnalytics: () =>
    api.get("/wards/analytics"),

  suggestAIAction: (data: { complaintId?: string; category: string; severity?: number; description: string }) =>
    api.post("/ai/suggest-action", data),

  getTransparencyReport: () =>
    api.get("/civic/transparency-report"),

  analyzeUnified: (data: { image?: string; latitude?: number; longitude?: number; title?: string; description?: string; category?: string }) =>
    api.post<UnifiedAIAnalysisResponse>("/ai/analyze", data),

  reverseGeocode: (latitude: number, longitude: number) =>
    api.post("/geocode/reverse", { latitude, longitude }),
};

export default api;
